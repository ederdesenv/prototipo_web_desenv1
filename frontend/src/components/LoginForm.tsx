// src/components/LoginForm.tsx
// RF001: Exibição e Interação da Tela de Login (janela modal centralizada)

import { useEffect, useRef, useState } from 'react'
import type { LoginFormData, LoginFormProps } from '../types/auth'

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LOGIN_VAZIO: LoginFormData = {
  email: '',
  senha: '',
}

function LoginForm({ onFechar, onEntrar, onIrParaCadastro }: LoginFormProps) {
  // ── Formulário controlado (useState) ─────────────────────────────────────
  const [form, setForm] = useState<LoginFormData>(LOGIN_VAZIO)
  const [lembrar, setLembrar] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  // ── useEffect: ação reativa ao abrir a modal ─────────────────────────────
  // Simula uma pequena verificação inicial (ex.: checar sessão) e ajusta o
  // título da página enquanto a modal de login está aberta.
  const [verificandoSessao, setVerificandoSessao] = useState(true)

  useEffect(() => {
    const tituloOriginal = document.title
    document.title = 'Login | OpsDrone'

    // Foca o campo de e-mail assim que a modal é exibida
    emailRef.current?.focus()

    // Simula uma requisição de verificação de sessão/autenticação
    const timer = window.setTimeout(() => setVerificandoSessao(false), 500)

    return () => {
      document.title = tituloOriginal
      window.clearTimeout(timer)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erro) setErro('')
  }

  // ── onSubmit: captura o envio e valida antes de enviar ao pai ────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (enviando) return

    if (!form.email.trim() || !form.senha.trim()) {
      setErro('Preencha e-mail e senha para continuar.')
      return
    }
    // Mesma regra do back-end (zod): e-mail válido
    if (!REGEX_EMAIL.test(form.email.trim())) {
      setErro('Email inválido')
      return
    }

    // Callback via props: envia os dados validados para o componente pai
    // (o pai chama o back-end; se o servidor recusar, mostramos a mensagem aqui)
    setEnviando(true)
    try {
      await onEntrar(form)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  function handleCadastroClick(e: React.MouseEvent) {
    e.preventDefault()
    onIrParaCadastro()
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
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg overflow-hidden rounded-4 position-relative">
          <button
            type="button"
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
            style={{ zIndex: 10 }}
            aria-label="Fechar"
            onClick={onFechar}
          />

          <div className="row g-0 flex-column flex-md-row">
            {/* ── Painel de marca (logo + nome da empresa) ────────────────── */}
            <div className="col-12 col-md-5 bg-success text-white d-flex flex-column align-items-center justify-content-center text-center p-4 py-5">
              <img
                src="imagem/logo-navbar.png"
                alt="Logo OPSDrone"
                className="mb-3"
                style={{ height: '90px', width: 'auto' }}
              />
        <span className="fs-2 fw-bold">
          <span style={{ color: '#FF5F00' }}>OPS</span><span style={{ color: '#002060' }}>Drone</span>
        </span>
            </div>

            {/* ── Formulário de login ──────────────────────────────────────── */}
            <div className="col-12 col-md-7 p-4 p-md-5">
              <h3 className="text-center text-success fw-bold mb-4">Login</h3>

              {verificandoSessao && (
                <div className="text-center text-secondary small mb-3">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verificando sessão...
                </div>
              )}

              {erro && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-3 border-bottom">
                  <label htmlFor="login-email" className="visually-hidden">
                    E-mail
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="login-email"
                    name="email"
                    className="form-control border-0 px-0 shadow-none"
                    placeholder="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3 border-bottom">
                  <label htmlFor="login-senha" className="visually-hidden">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="login-senha"
                    name="senha"
                    className="form-control border-0 px-0 shadow-none"
                    placeholder="senha"
                    value={form.senha}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="login-lembrar"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="login-lembrar">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-center mb-3">
                  <button
                    type="submit"
                    className="btn btn-outline-success rounded-pill px-5 fw-semibold"
                    disabled={enviando}
                  >
                    {enviando ? 'ENTRANDO...' : 'ENTRAR'} <i className="bi bi-arrow-right-circle ms-2"></i>
                  </button>
                </div>

                <p className="text-center text-secondary small mb-0">
                  Primeiro acesso?{' '}
                  <a href="#cadastro" onClick={handleCadastroClick} className="fw-semibold">
                    Cadastre-se
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
