function formatarData(d: Date): string {
  const meses = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro',
  ]
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

function Footer() {
  const hoje = new Date()
  const dataFormatada = formatarData(hoje)

  return (
    <footer id="Contato" className="bg-dark text-white py-3">
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span className="fw-bold">Contato</span>
          <div className="text-white-50 small mt-1">
            Éder Couto · Especialização Desenvolvimento Web e Mobile · IF Sudeste de Minas Gerais
          </div>
        </div>
        <div className="text-white-50 small text-end">
          <div>{dataFormatada}</div>
          <div>ecouto_dev@hotmail.com</div>
        </div>
        <div className="d-flex gap-3">
          <a href="#sobre" className="text-white-50 small text-decoration-none">Topo</a>
          <a href="https://github.com/ederdesenv" target="_blank" rel="noreferrer" className="text-white-50">
            <i className="bi bi-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/%C3%A9der-couto-2233603a/" target="_blank" rel="noreferrer" className="text-white-50">
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
