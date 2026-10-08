// src/components/CadastrosMenu.tsx
// Tela aberta pelo botão [Ajustar Cadastros] do card "manutenção".
// Exibe os cadastros disponíveis como cards pequenos.

import type { CadastrosMenuProps } from '../types/aeronave'

function CadastrosMenu({ onSelecionar }: CadastrosMenuProps) {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="bi bi-gear text-primary fs-4"></i>
          <span className="badge bg-primary text-dark">manutenção</span>
        </div>
        <h2 className="fw-bold text-dark mb-1">Ajustar Cadastros</h2>
        <p className="text-secondary mb-0">Escolha o cadastro que deseja manter.</p>
      </div>

      <div className="row g-3">
        {/* Cadastro de Pilotos — ainda sem back-end, por isso desabilitado */}
        <div className="col-sm-6 col-md-4 col-lg-3">
          <div
            className="card h-100 border-top border-secondary border-3 shadow-sm opacity-50"
            aria-disabled="true"
          >
            <div className="card-body text-center py-4">
              <i className="bi bi-person-badge fs-1 text-secondary d-block mb-2"></i>
              <h6 className="card-title fw-bold mb-1">Cadastro de Pilotos</h6>
              <span className="badge bg-secondary-subtle text-secondary">Em breve</span>
            </div>
          </div>
        </div>

        {/* Cadastro de Aeronaves */}
        <div className="col-sm-6 col-md-4 col-lg-3">
          <button
            type="button"
            className="card h-100 w-100 border-top border-primary border-3 shadow-sm text-start bg-white"
            onClick={() => onSelecionar('aeronaves')}
          >
            <div className="card-body text-center py-4 w-100">
              <i className="bi bi-airplane fs-1 text-primary d-block mb-2"></i>
              <h6 className="card-title fw-bold mb-1">Cadastro de Aeronaves</h6>
              <span className="badge bg-primary-subtle text-primary">Abrir</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CadastrosMenu
