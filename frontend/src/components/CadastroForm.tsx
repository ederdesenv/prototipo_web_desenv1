// src/components/CadastroForm.tsx
// RF002: Tela de Cadastro de Usuário (janela modal centralizada)

import { useEffect, useState } from 'react'
import type { CadastroFormData, CadastroFormProps } from '../types/auth'

const CADASTRO_VAZIO: CadastroFormData = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
}

const REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CadastroForm({ onFechar, onCadastrar }: CadastroFormProps) {
  // ── Formulário controlado (useState) ─────────────────────────────────────
  const [form, setForm] = useState<CadastroFormData>(CADASTRO_VAZIO)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  // ── useEffect: ação reativa ─────────────────────────────────────────────
  // Ajusta o título da página enquanto a modal de cadastro está aberta e
  // simula uma verificação de disponibilidade do e-mail digitado (debounce).
  const [statusEmail, setStatusEmail] = useState<'' | 'verificando' | 'disponivel'>('')

  useEffect(() => {
    const tituloOriginal = document.title
    document.title = 'Cadastro de Usuário | OpsDrone'
    return () => {
      document.title = tituloOriginal
    }
  }, [])

  useEffect(() => {
    if (!REGEX_EMAIL.test(form.email)) {
      setStatusEmail('')
      return
    }
    setStatusEmail('verificando')
    // Simula uma requisição assíncrona de verificação de e-mail
    const timer = window.setTimeout(() => setStatusEmail('disponivel'), 600)
    return () => window.clearTimeout(timer)
  }, [form.email])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erro) setErro('')
  }

  // ── onSubmit: valida obrigatoriedade, formato e senhas iguais ────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (enviando) return

    if (!form.nome.trim() || !form.email.trim() || !form.senha || !form.confirmarSenha) {
      setErro('Todos os campos são obrigatórios.')
      return
    }
    if (!REGEX_NOME.test(form.nome.trim())) {
      setErro('O nome deve conter apenas letras e espaços.')
      return
    }
    if (!REGEX_EMAIL.test(form.email.trim())) {
      setErro('Informe um e-mail em formato válido (exemplo@dominio.com).')
      return
    }
    // Mesma regra do back-end (zod): senha com no mínimo 6 caracteres
    if (form.senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres')
      return
    }
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas informadas não são iguais.')
      return
    }

    // Callback via props: envia os dados validados para o componente pai
    // (o pai chama o back-end; se o servidor recusar, mostramos a mensagem aqui)
    setEnviando(true)
    try {
      await onCadastrar(form)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível cadastrar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh' }}
      onClick={onFechar}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg overflow-hidden">
          <div className="modal-header bg-success border-0 py-3">
            <h5 className="modal-title fw-bold w-100 text-center text-white mb-0">
              Cadastro de Usuário
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 me-3"
              aria-label="Fechar"
              onClick={onFechar}
            />
          </div>

          <div className="modal-body p-4">
            {erro && (
              <div className="alert alert-danger py-2 small" role="alert">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group mb-3">
                <label htmlFor="cad-nome" className="form-label fw-semibold">
                  Nome
                </label>
                <input
                  type="text"
                  id="cad-nome"
                  name="nome"
                  className="form-control"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="cad-email" className="form-label fw-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="cad-email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                {statusEmail === 'verificando' && (
                  <small className="text-secondary">
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      style={{ width: '0.75rem', height: '0.75rem' }}
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verificando e-mail...
                  </small>
                )}
                {statusEmail === 'disponivel' && (
                  <small className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    E-mail disponível.
                  </small>
                )}
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6 form-group">
                  <label htmlFor="cad-senha" className="form-label fw-semibold">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="cad-senha"
                    name="senha"
                    className="form-control"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="cad-confirmarSenha" className="form-label fw-semibold">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="cad-confirmarSenha"
                    name="confirmarSenha"
                    className="form-control"
                    placeholder="Confirmar Senha"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100 fw-semibold" disabled={enviando}>
                <i className="bi bi-plus-circle-fill me-2"></i>
                {enviando ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroForm
