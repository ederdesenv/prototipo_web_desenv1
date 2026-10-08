// src/types/auth.ts
// Tipagens usadas pelos formulários de Login (RF001) e Cadastro (RF002)

// ── RF001: Login ────────────────────────────────────────────────────────────
export interface LoginFormData {
  email: string
  senha: string
}

export interface LoginFormProps {
  /** Fecha a modal sem realizar nenhuma ação */
  onFechar: () => void
  /** Callback (assíncrono) disparado para o pai com os dados validados do login.
   *  Se lançar erro, a mensagem é exibida dentro da modal. */
  onEntrar: (dados: LoginFormData) => void | Promise<void>
  /** Disparado ao clicar em "Cadastre-se": fecha o login e abre o cadastro */
  onIrParaCadastro: () => void
}

// ── RF002: Cadastro de Usuário ──────────────────────────────────────────────
export interface CadastroFormData {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

export interface CadastroFormProps {
  /** Fecha a modal sem realizar nenhuma ação */
  onFechar: () => void
  /** Callback (assíncrono) disparado para o pai com os dados validados do cadastro.
   *  Se lançar erro, a mensagem é exibida dentro da modal. */
  onCadastrar: (dados: CadastroFormData) => void | Promise<void>
}
