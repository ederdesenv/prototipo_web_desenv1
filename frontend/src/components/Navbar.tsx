interface NavbarProps {
  onLoginClick: () => void
  onCadastroClick: () => void
  /** Nome do usuário logado (quando existir, substitui os botões Login/Cadastre-se) */
  usuarioNome?: string | null
  onLogoutClick?: () => void
}

function Navbar({ onLoginClick, onCadastroClick, usuarioNome, onLogoutClick }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm fixed-top">
      <div className="container">
        <a
          className="navbar-brand"
          href="#"
          style={{ paddingTop: 0, paddingBottom: 0, display: 'flex', alignItems: 'center' }}
        >
        <img
          src="imagem/logo-navbar.png"
          alt="Logo OPSDrone"
          style={{ height: '40px', width: 'auto', marginRight: '8px' }}
        />
        <span className="fs-2 fw-bold">
          <span style={{ color: '#FF5F00' }}>OPS</span><span style={{ color: '#002060' }}>Drone</span>
        </span>
        </a>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <a className="nav-link" href="#sobre">Sobre</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#funcionalidades">Funcionalidades</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#tecnologias">Tecnologias</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#Contato">Contato</a>
            </li>
            {usuarioNome ? (
              <>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0 d-flex align-items-center">
                  <span className="navbar-text fw-semibold text-success py-0" data-testid="usuario-logado">
                    <i className="bi bi-person-circle me-1"></i>
                    {usuarioNome}
                  </span>
                </li>
                <li className="nav-item mt-1 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={onLogoutClick}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={onLoginClick}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item mt-1 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-success btn-sm w-100"
                    onClick={onCadastroClick}
                  >
                    Cadastre-se
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
