import { useState } from 'react'
import OrdemServicoForm from './OrdemServicoForm'
import StatusOrdemServico from './StatusOrdemServico'
import CadastrosMenu from './CadastrosMenu'
import AeronaveForm from './AeronaveForm'
import type { CardFuncionalidade } from '../types/ordemServico'

type Filtro = 'todos' | 'fe' | 'st' | 'ux' | 'da' | 're' | 'mp'

const cards: CardFuncionalidade[] = [
  {
    category: 'fe',
    badge: 'Cadastro',
    badgeClass: 'bg-primary-subtle text-primary',
    iconClass: 'bi bi-layout-text-sidebar-reverse',
    iconColor: 'text-primary',
    title: 'Cadastro de Ordens de serviço',
    description: 'Aqui você cadastra uma nova Ordem de serviço',
    btnClass: 'btn btn-primary',
    btnLabel: 'Cadastrar',
    borderColor: 'border-primary',
  },
  {
    category: 'st',
    badge: 'Status OS',
    badgeClass: 'bg-success-subtle text-success',
    iconClass: 'bi bi-shield-lock',
    iconColor: 'text-success',
    title: 'Status da Ordem de Serviço',
    description: 'Aqui você acompanha os status da OS.',
    btnClass: 'btn btn-success',
    btnLabel: 'Acompanhar Status',
    borderColor: 'border-success',
  },
  {
    category: 're',
    badge: 'Relatórios',
    badgeClass: 'bg-warning-subtle text-warning',
    iconClass: 'bi bi-bar-chart-line',
    iconColor: 'text-warning',
    title: 'Relatórios de Ordens de Serviços',
    description: 'Geração de relatórios PDF/CSV com envio por e-mail.',
    btnClass: 'btn btn-warning',
    btnLabel: 'Gerar/Exportar',
    borderColor: 'border-warning',
  },
  {
    category: 'ux',
    badge: 'manutenção',
    badgeClass: 'bg-primary text-dark',
    iconClass: 'bi bi-phone',
    iconColor: 'text-info',
    title: 'Acesso a menu com todos os Cadastros',
    description: 'Aqui você edita os cadastros envolvidos na operação',
    btnClass: 'btn btn-primary',
    btnLabel: 'Ajustar Cadastros',
    borderColor: 'border-primary',
  },
  {
    category: 'mp',
    badge: 'Mapas',
    badgeClass: 'bg-success-subtle text-success',
    iconClass: 'bi bi-bell',
    iconColor: 'text-success',
    title: 'Consultar mapa da área de operação',
    description: 'Área restrita a usuários administradores',
    btnClass: 'btn btn-success',
    btnLabel: 'Consultar Mapa',
    borderColor: 'border-success',
  },
  {
    category: 'da',
    badge: 'Dados',
    badgeClass: 'bg-warning-subtle text-warning',
    iconClass: 'bi bi-database-check',
    iconColor: 'text-warning',
    title: 'Consultar Dados Climáticos',
    description: 'Área restrita a usuários administradores',
    btnClass: 'btn btn-warning',
    btnLabel: 'Consultar API',
    borderColor: 'border-warning',
  },
]

interface FilterBtn {
  filter: Filtro
  label: string
  cor: string
}

const filterBtns: FilterBtn[] = [
  { filter: 'todos', label: 'Todos',      cor: 'primary' },
  { filter: 'fe',    label: 'Cadastro',   cor: 'primary' },
  { filter: 'st',    label: 'Status OS',  cor: 'success' },
  { filter: 'ux',    label: 'manutenção', cor: 'info'    },
  { filter: 'da',    label: 'Dados',      cor: 'warning' },
  { filter: 're',    label: 'Relatórios', cor: 'warning' },
  { filter: 'mp',    label: 'mapas',      cor: 'success' },
]

function Funcionalidades() {
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>('todos')
  // Controla qual tela está aberta ('fe' | 'st' | 'ux' | 'aeronaves' | null)
  const [paginaAberta, setPaginaAberta] = useState<string | null>(null)

  const cardsFiltrados = cards.filter(
    (c) => filtroAtivo === 'todos' || c.category === filtroAtivo
  )

  // ── Se o formulário de Cadastro estiver aberto, exibe a página de formulário
  if (paginaAberta === 'fe') {
    return (
      <section id="funcionalidades" className="bg-white py-5">
        {/* Barra de navegação de volta */}
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setPaginaAberta(null)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Funcionalidades
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Cadastro de Ordens de Serviço
              </li>
            </ol>
          </nav>
        </div>

        {/* Formulário com todas as props configuradas */}
        <OrdemServicoForm
          mostrarCabecalho={true}
          exibirAvisoObrigatorios={true}
          mensagemSucesso="Ordem de Serviço gravada com sucesso! ✔"
          onGravar={(dados) => {
            console.log('OS gravada:', dados)
          }}
        />
      </section>
    )
  }

  // ── Se a tela de Status da OS estiver aberta, exibe StatusOrdemServico
  if (paginaAberta === 'st') {
    return (
      <section id="funcionalidades" className="bg-white py-5">
        {/* Barra de navegação de volta */}
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setPaginaAberta(null)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Funcionalidades
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Status da Ordem de Serviço
              </li>
            </ol>
          </nav>
        </div>

        <StatusOrdemServico mostrarCabecalho={true} />
      </section>
    )
  }

  // ── Se 'Ajustar Cadastros' estiver aberto, exibe o menu de cadastros (cards pequenos)
  if (paginaAberta === 'ux') {
    return (
      <section id="funcionalidades" className="bg-white py-5">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setPaginaAberta(null)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Funcionalidades
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Ajustar Cadastros
              </li>
            </ol>
          </nav>
        </div>

        <CadastrosMenu
          onSelecionar={(cadastro) => {
            if (cadastro === 'aeronaves') setPaginaAberta('aeronaves')
          }}
        />
      </section>
    )
  }

  // ── Se o Cadastro de Aeronaves estiver aberto, exibe o formulário (Incluir/Alterar/Deletar/Pesquisar)
  if (paginaAberta === 'aeronaves') {
    return (
      <section id="funcionalidades" className="bg-white py-5">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setPaginaAberta(null)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Funcionalidades
                </button>
              </li>
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setPaginaAberta('ux')}
                >
                  Ajustar Cadastros
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Cadastro de Aeronaves
              </li>
            </ol>
          </nav>
        </div>

        <AeronaveForm mostrarCabecalho={true} />
      </section>
    )
  }

  // ── Tela normal com cards e filtros
  return (
    <section id="funcionalidades" className="bg-white py-5">
      <div className="container">
        <h2 className="fw-bold text-dark mb-2">Funcionalidades Principais</h2>
        <p className="text-secondary mb-4">
          Filtre por categoria para explorar as capacidades do sistema.
        </p>

        {/* Filtros */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {filterBtns.map((btn) => {
            const ativo = filtroAtivo === btn.filter
            return (
              <button
                key={btn.filter}
                className={`btn ${ativo ? `btn-${btn.cor}` : `btn-outline-${btn.cor}`} btn-sm rounded-pill`}
                onClick={() => setFiltroAtivo(btn.filter)}
              >
                {btn.label}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="row g-4">
          {cardsFiltrados.map((card) => (
            <div key={card.category + card.title} className="col-md-6 col-lg-4">
              <div className={`card h-100 border-top ${card.borderColor} border-3 shadow-sm`}>
                <div className="card-body d-flex flex-column">
                  <span className={`badge ${card.badgeClass} mb-2 align-self-start`}>
                    {card.badge}
                  </span>
                  <div className={`fs-3 ${card.iconColor} mb-2`}>
                    <i className={card.iconClass}></i>
                  </div>
                  <h6 className="card-title fw-bold">{card.title}</h6>
                  <p className="card-text text-secondary small flex-grow-1">
                    {card.description}
                  </p>
                  {/* Botão: abre formulário para 'fe', status para 'st', cadastros para 'ux' */}
                  {card.category === 'fe' || card.category === 'st' || card.category === 'ux' ? (
                    <button
                      className={card.btnClass}
                      onClick={() => setPaginaAberta(card.category)}
                    >
                      {card.btnLabel}
                    </button>
                  ) : (
                    <a href="#" className={card.btnClass}>
                      {card.btnLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sem resultados */}
        {cardsFiltrados.length === 0 && (
          <div className="text-center text-secondary py-5">
            <i className="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
            Nenhum card para esta categoria.
          </div>
        )}
      </div>
    </section>
  )
}

export default Funcionalidades
