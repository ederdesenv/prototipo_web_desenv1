//imports
import "dotenv/config"; 
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "./lib/prisma";
import cors from 'cors';
import { PrismaClient,Prisma } from "./generated/prisma/client";
import { z, ZodError } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()) // necessário para ler req.body em JSON

const port = process.env.PORT || 3000;
app.use(express.json());

// Schemas de validação para autenticação
const registerSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    name: z.string().optional()
})

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

// Chave secreta para JWT (em produção, isso vai para variável de ambiente)
const JWT_SECRET = 'seu_jwt_secret_super_seguro_aqui'

// Interface para estender o Request do Express
interface AuthRequest extends Request {
    user?: {
        id: number
        email: string
        name?: string | null
    }
}

/**
 * Middleware de autenticação
 * - Extrai token do header Authorization
 * - Verifica se token é válido
 * - Busca usuário no banco
 * - Anexa usuário à requisição para uso posterior
 */
const authMiddleware = async (req: AuthRequest, res: Response, next: any) => {
    try {
        // 1. Extrair token do header Authorization
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ error: 'Token de acesso não fornecido' })
        }

        // Header deve ser: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Formato do token inválido' })
        }

        // 2. Verificar se token é válido
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }

        // 3. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true } // Não buscar a senha
        })

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' })
        }

        // 4. Anexar usuário à requisição
        req.user = user

        // 5. Continuar para a próxima função (rota final)
        next()

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token inválido' })
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

// Rota simples só para conferir se o servidor está no ar
app.get('/', (req, res) => {
    res.json({ ok: true, msg: 'API de Aeronaves no ar!' })
})

/**
 * GET /api/auth/me
 * - Rota protegida para verificar se token está funcionando
 * - Retorna informações do usuário logado
 */
app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
    // Se chegou até aqui, o middleware já validou o token
    return res.status(200).json({
        message: 'Usuário autenticado',
        user: req.user
    })
})

/**
 * POST /api/auth/register
 * - Valida os dados de entrada
 * - Verifica se o email já existe
 * - Cria hash da senha
 * - Salva usuário no banco
 * - Retorna token JWT
 */
app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
        // 1. Validar dados de entrada
        const { email, password, name } = registerSchema.parse(req.body)

        // 2. Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso' })
        }

        // 3. Criar hash da senha (10 rounds é um bom padrão de segurança)
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Criar usuário no banco
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })

        // 5. Gerar token JWT
        const token = jwt.sign(
            { userId: user.id }, // Payload: informações que queremos no token
            JWT_SECRET,
            { expiresIn: '7d' } // Token expira em 7 dias
        )

        // 6. Retornar sucesso (sem a senha!)
        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

/**
 * POST /api/auth/login
 * - Valida os dados de entrada
 * - Busca usuário pelo email
 * - Compara senha fornecida com hash salvo
 * - Retorna token JWT se autenticação for bem-sucedida
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        // 1. Validar dados de entrada
        const { email, password } = loginSchema.parse(req.body)

        // 2. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' })
        }

        // 3. Comparar senha fornecida com hash salvo
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou senha incorretos' })
        }

        // 4. Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // 5. Retornar sucesso
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

app.get('/api/aeronaves', async (req, res) => {
    try {
        const aeronaves = await prisma.aeronave.findMany()
        return res.status(200).json(aeronaves)
    } catch (error) {
        // Se algo der errado (ex.: banco fora do ar), avisamos com 500
        return res.status(500).json({ error: 'Erro ao listar aeronaves' })
    }
})

app.get('/api/aeronaves/:id', async (req, res) => {
    const id = Number(req.params.id)

    // Validação simples do ID (evita NaN e números inválidos)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido. Use um inteiro positivo.' })
    }

    try {
        const aeronaves = await prisma.aeronave.findUnique({ where: { id } })

        if (!aeronaves) {
            return res.status(404).json({ error: 'aeronave não encontrado' })
        }

        return res.status(200).json(aeronaves)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar aeronave' })
    }
})

/**
 * Schemas Zod
 * - createProductSchema: criação (campos obrigatórios)
 * - updateProductSchema: atualização parcial (todos opcionais)
 */
// Schema de criação de produto
export const createAeronaveSchema = z.object({
    fabricante: z.string().min(3, 'Fabricante deve ter pelo menos 3 caracteres'),
    modelo: z.string().min(1, 'Modelo não pode ser vazio'),
    numeroSerie: z.string().min(1, 'Número de série não pode ser vazio'),
    pesoMaximoDecolagem: z.coerce.number().positive('Peso máximo de decolagem deve ser maior que zero'),
    codigoSisant: z.string().min(1, 'Código SISANT não pode ser vazio'),
    capacidadeTanque: z.coerce.number().positive('Capacidade do tanque deve ser maior que zero'),
})

/**
 * POST /api/aeronaves — cria com validação e Proteção
 * Apenas usuarios autenticado podem criar aeronaves
 */
app.post('/api/aeronaves', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { fabricante, modelo, numeroSerie, pesoMaximoDecolagem,codigoSisant,capacidadeTanque } = createAeronaveSchema.parse(req.body)

        const aeronave = await prisma.aeronave.create({
            data: { fabricante, modelo, numeroSerie, pesoMaximoDecolagem,codigoSisant,capacidadeTanque } 
        })

        return res.status(201).json({
            message: 'Aeronave criada com sucesso',
            aeronave
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ error: 'Já existe uma aeronave com este número de série ou código SISANT' })
        }
        return res.status(500).json({ error: 'Erro ao criar Aeronave' })
    }
})

const updateAeronaveSchema = createAeronaveSchema.partial()

/**
 * PUT /api/aeronaves/:id — atualização parcial com validação e Proteção
 * (a rota antiga /api/products/:id continua disponível por compatibilidade)
 */
const updateAeronaveHandler = async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const data = updateAeronaveSchema.parse(req.body)

        const product = await prisma.aeronave.update({
            where: { id },
            data
        })

        return res.status(200).json({
            message: 'Aeronave atualizada com sucesso',
            product
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Aeronave não encontrada' })
            }
            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'Já existe uma aeronave com este número de série ou código SISANT' })
            }
        }
        return res.status(500).json({ error: 'Erro ao atualizar Aeronave' })
    }
}

app.put('/api/aeronaves/:id', authMiddleware, updateAeronaveHandler)
app.put('/api/products/:id', authMiddleware, updateAeronaveHandler)

/**
 * DELETE /api/aeronaves/:id — remove item
 * (a rota antiga /api/products/:id continua disponível por compatibilidade)
 */
const deleteAeronaveHandler = async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        await prisma.aeronave.delete({ where: { id } })

        return res.status(200).json({
            message: 'Aeronave deletada com sucesso'
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ error: 'Aeronave não encontrada' })
        }
        return res.status(500).json({ error: 'Erro ao deletar Aeronave' })
    }
}

app.delete('/api/aeronaves/:id', authMiddleware, deleteAeronaveHandler)
app.delete('/api/products/:id', authMiddleware, deleteAeronaveHandler)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

