# Autenticação e Middleware no Express no contexto do TCC - Cadastro de Aeronaves e Login 

## Sobre o projeto

Este documento apresenta a instalação e configuração do backend do protótipo do TCC: uma API REST em Node.js, TypeScript e Express, com PostgreSQL via Prisma ORM, rodando em Docker.

O domínio escolhido foi o cadastro de drones agrícolas (fabricante, modelo, número de série, peso, código SISANT/ANAC e capacidade de tanque), por representar um cenário real que exige registro e rastreabilidade regulatória, permitindo controle centralizado da frota. Academicamente, o domínio oferece um modelo de dados simples e realista para demonstrar arquitetura backend, modelagem de dados e exposição de API REST.

## Pré-requisitos

- \[Node.js]<https://nodejs.org/>

- \[Docker]<https://www.docker.com/>  \[Docker Compose](https://docs.docker.com/compose/) 

- Editor de código VS Code

## 1. Conceito e Instalação do Bcrypt.js e JSON Web Token (JWT)

Bcrypt.js é uma biblioteca em JavaScript (escrita em código puro, sem dependências nativas em C/C++) usada para criptografar e verificar senhas de forma segura através do algoritmo de hashing Bcrypt.

JSON Web Token (JWT) é um padrão aberto (RFC 7519) compacto e independente usado para transmitir informações com segurança entre partes como um objeto JSON.

Ele é amplamente utilizado no desenvolvimento web para autenticação (gerenciamento de sessão de usuário) e troca de informações autorizadas entre cliente (ex: React, Flutter) e servidor (Node.js, Python, Java).


```bash
npm install bcryptjs jsonwebtoken 
```
**Saída:**

```
PS C:\eder_dados\POS\SISTEMAS\TEC_BACKEND\prototipo_web_desenv_LOCAL3\backend_crud2> npm install bcryptjs jsonwebtoken 

added 15 packages, and audited 258 packages in 9s

44 packages are looking for funding
  run `npm fund` for details

6 vulnerabilities (1 moderate, 4 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

```
### 1.1 - Instalar os tipos TypeScript para o pacote jsonwebtoken

O comando npm install -D @types/jsonwebtoken instala as definições de tipos TypeScript para a biblioteca jsonwebtoken.

```bash
npm install -D @types/jsonwebtoken
```

### 1.2 Adicionar os imports no server.ts

No **server.ts** adicionar a linha de comando na seção de imports: 

```typescript
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
```

### 2 - Ajustar o schema.prisma 

Ir no arquivo schema.prisma e adicionar o script:

```typescript
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // Sempre será armazenado como hash, nunca texto puro
  name      String?  // Campo opcional para nome do usuário
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users") // Nome da tabela no banco será "users"
}
```

obs.: @@map -> define como se chamara a tabela no banco fisico

Executar 

```bash
npx prisma migrate dev --name create_users
```
**Saída:**
```
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "cadastro_aeronaves", schema "public" at "localhost:5432"

Applying migration `20261007123935_create_users`

The following migration(s) have been created and applied from new schema changes:

prisma\migrations/
  └─ 20261007123935_create_users/
    └─ migration.sql

Your database is now in sync with your schema.
```

Abrir o ***npx prisma studio*** para conferir 

## 3. Codificar as Rotas e Regras do login

### 3.1 - Schemas de validação para autenticação

No **server.ts**, adicionar o trecho de código: 

```typescript
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
```
### 3.2 - Register e Login com Geração de token JWT 

```typescript
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
            return res.status(400).json({ error: error.errors[0].message })
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
            return res.status(400).json({ error: error.errors[0].message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
})


/**
 * GET /api/products
 * - Busca todos os produtos direto no banco via Prisma
 * - Retorna um array de produtos
 */
app.get('/api/products', async (_req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany()
        return res.status(200).json(products)
    } catch (error) {
        // Se algo der errado (ex.: banco fora do ar), avisamos com 500
        return res.status(500).json({ error: 'Erro ao listar produtos' })
    }
})

/**
 * GET /api/products/:id
 * - Converte o :id da URL para número
 * - Se o produto existir, retorna 200 com o produto
 * - Se não existir, retorna 404 com uma mensagem clara
 * - Se o id for inválido (NaN, negativo), retorna 400
 */
app.get('/api/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    // Validação simples do ID (evita NaN e números inválidos)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido. Use um inteiro positivo.' })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } })

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' })
        }

        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar produto' })
    }
})
```

## 4. Ajustar as Rotas da api/aeronaves para se adequarem a autenticação 

No projeto anterior a api/aeronaves não tinha proteção ,a partir deste projeto as rotas passaram a ter a proteção authMiddleware

```typescript
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

/**
 * DELETE /api/aeronaves/:id — remove item com Proteção 
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

# 5. Casos de Testes 
## 5.1 - Testes com o cadastro de Login 
**Caso de Teste 1**: Register de login valido

**Endpoint**
```http
POST http://localhost:3000/api/auth/register
```

**Body(json)**

```json
{
  "email": "heitor@email.com",
  "password": "123456",
  "name": "Heitor"
}
```
**Result:**
```bash
201 Created
```

**Preview**
```json
{
	"message": "Usuário criado com sucesso",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc5MTQ2ODAzMCwiZXhwIjoxNzkyMDcyODMwfQ.fKgip5UB2ch5hjuoU_VNydmX8Hr_X7Rm2_1QDsjW_zQ",
	"user": {
		"id": 3,
		"email": "heitor@email.com",
		"name": "Heitor"
	}
}
```

**Caso de Teste 2**: Register de login invalido (name diferente porém mesmo e-mail)

**Endpoint**
```http
POST http://localhost:3000/api/auth/register
```

**Body(json)**

```json
{
  "email": "heitor@email.com",
  "password": "123456",
  "name": "Pedro"
}
```
**Result:**
```bash
400 Bad Request
```

**Preview**
```json
{
	"error": "Email já está em uso"
}
```
**Caso de Teste 3**:Tentativa de Register de login com falha no schema

**Endpoint**
```http
POST http://localhost:3000/api/auth/register
```

**Body(json)**

```json
{
  "email": "pedro@email.com",
  "password": "12345",
  "name": "Pedro"
}
```
**Result:**
```bash
400 Bad Request
```

**Preview**
```json
{
	"error": "Senha deve ter pelo menos 6 caracteres"
}
```

**Caso de Teste 4**: Login com Sucesso

**Endpoint**
```http
POST http://localhost:3000/api/auth/login
```

**Body(json)**

```json
{
  "email": "teste@email.com",
  "password": "123456"
}
```
**Result:**
```bash
200 OK
```

**Preview**
```json
{
	"message": "Login realizado com sucesso",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc5MTQ2ODYzMSwiZXhwIjoxNzkyMDczNDMxfQ.obWsXWHMPlE82N2phPBK_e1wjcznJq8aXeRkaGI5vUY",
	"user": {
		"id": 1,
		"email": "teste@email.com",
		"name": "João Silva"
	}
}
```

**Caso de Teste 5**: Falha no login 

**Endpoint**
```http
POST http://localhost:3000/api/auth/login
```

**Body(json)**

```json
{
  "email": "teste@email.com",
  "password": "12345"
}
```
**Result:**
```bash
401 Unauthorized
```

**Preview**
```json
{
	"error": "Email ou senha incorretos"
}
```
**Caso de Teste 6**: Autenticar Usuário com sucesso

**Endpoint**
```http
GET http://localhost:3000/api/auth/me
```

**Headers**

```json
Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc5MTM4MjUyOSwiZXhwIjoxNzkxOTg3MzI5fQ.KDA9cV54N07L5DmIxei6akyHGIpt1Rq8zH3za8gGHRo
```
**Result:**
```bash
200 OK
```

**Preview**
```json
{
	"message": "Usuário autenticado",
	"user": {
		"id": 1,
		"email": "teste@email.com",
		"name": "João Silva"
	}
}
```
**Caso de Teste 7**: Falha na Autenticação do Usuário

**Endpoint**
```http
GET http://localhost:3000/api/auth/me
```

**Headers**
não informado

**Result:**
```bash
401 Unauthorized
```

**Preview**
```json
{
	"error": "Token de acesso não fornecido"
}
```
**Caso de Teste 8**: Cadastro de aeronave com autenticação de usuário 

**Endpoint**
```http
http://localhost:3000/api/aeronaves
```

**Body(json)**
```json
{
  "id": 12,
  "fabricante": "XAG",
  "modelo": "Phenom 300",
  "numeroSerie": "SN-2026-999999",
  "pesoMaximoDecolagem": 8150.00,
  "codigoSisant": "SISANT-999999",
  "capacidadeTanque": 2400.00
}
```

**Headers**
```json
Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc5MTM4MjUyOSwiZXhwIjoxNzkxOTg3MzI5fQ.KDA9cV54N07L5DmIxei6akyHGIpt1Rq8zH3za8gGHRo
```

**Result:**
```bash
201 Created
```

**Preview**
```json
{
	"message": "Aeronave criada com sucesso",
	"aeronave": {
		"id": 12,
		"fabricante": "XAG",
		"modelo": "Phenom 300",
		"numeroSerie": "SN-2026-999999",
		"pesoMaximoDecolagem": "8150",
		"codigoSisant": "SISANT-999999",
		"capacidadeTanque": "2400",
		"createdAt": "2026-10-08T14:37:49.803Z",
		"updatedAt": "2026-10-08T14:37:49.803Z"
	}
}
```
**Caso de Teste 9**: Cadastro de aeronave com falha na autenticação de usuário 

**Endpoint**
```http
http://localhost:3000/api/aeronaves
```

**Body(json)**
```json
{
  "id": 13,
  "fabricante": "XAG",
  "modelo": "Phenom 300",
  "numeroSerie": "SN-2026-999999",
  "pesoMaximoDecolagem": 8150.00,
  "codigoSisant": "SISANT-999999",
  "capacidadeTanque": 2400.00
}
```

**Headers**
```json
não informado
```

**Result:**
```bash
201 Created
```

**Preview**
```json
{
	"error": "Token de acesso não fornecido"
}
```