import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Funcionalidades from './components/Funcionalidades'
import Tecnologias from './components/Tecnologias'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import CadastroForm from './components/CadastroForm'
import type { LoginFormData, CadastroFormData } from './types/auth'
import { useAuth } from './Contexts/AuthContext'

// App.tsx — ponto de entrada da aplicação.
// Compõe todos os componentes da página na ordem correta.
// O componente OrdemServicoForm é renderizado dentro de
// Funcionalidades, quando o usuário clica em "Cadastrar".
//
// App também é o componente PAI das modais de Login (RF001) e
// Cadastro de Usuário (RF002): ele controla qual modal está aberta e
// recebe, via callback nas props, os dados enviados por cada formulário.

type ModalAberta = 'login' | 'cadastro' | null

function App() {
  const { user, login, register, logout } = useAuth()
  const [modalAberta, setModalAberta] = useState<ModalAberta>(null)
  const [mensagem, setMensagem] = useState('')

  // Login: chama POST /api/auth/login (regras do zod no back-end).
  // Se o servidor recusar, o erro volta para a modal exibir a mensagem.
  async function handleEntrar(dados: LoginFormData) {
    await login({ email: dados.email.trim(), password: dados.senha })
    setMensagem('Logado com Sucesso')
    setModalAberta(null)
  }

  // Cadastro: chama POST /api/auth/register (regras do zod no back-end).
  // O back-end já devolve o token, então o usuário fica logado em seguida.
  async function handleCadastrar(dados: CadastroFormData) {
    await register({
      name: dados.nome.trim(),
      email: dados.email.trim(),
      password: dados.senha,
    })
    setMensagem('Cadastro realizado com sucesso! Logado com Sucesso')
    setModalAberta(null)
  }

  function handleLogout() {
    logout()
    setMensagem('Você saiu da conta.')
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setModalAberta('login')}
        onCadastroClick={() => setModalAberta('cadastro')}
        usuarioNome={user ? (user.name?.trim() || user.email) : null}
        onLogoutClick={handleLogout}
      />
      <main>
        <Hero />
        <Funcionalidades />   {/* ← contém o OrdemServicoForm */}
        <Tecnologias />
      </main>
      <Footer />

      {mensagem && (
        <div
          className="alert alert-success shadow position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 1080 }}
          role="alert"
        >
          {mensagem}
          <button
            type="button"
            className="btn-close ms-3"
            aria-label="Fechar"
            onClick={() => setMensagem('')}
          />
        </div>
      )}

      {modalAberta === 'login' && (
        <LoginForm
          onFechar={() => setModalAberta(null)}
          onEntrar={handleEntrar}
          onIrParaCadastro={() => setModalAberta('cadastro')}
        />
      )}

      {modalAberta === 'cadastro' && (
        <CadastroForm
          onFechar={() => setModalAberta(null)}
          onCadastrar={handleCadastrar}
        />
      )}
    </>
  )
}

export default App
