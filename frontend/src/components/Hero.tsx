function Hero() {
  return (
    <section id="sobre" className="bg-success text-white" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-3">
              Sistema Web de Gestão Ordens de Serviço de Drones de Pulverização
            </h1>
            <p className="lead text-white-50 mb-4">
              Plataforma Web: Gestão de Ordens de Serviço para Drones de Pulverização e Monitoramento Climático.
            </p>
            <a href="#funcionalidades" className="btn btn-warning fw-semibold mb-4">
              Ver Funcionalidades <i className="bi bi-arrow-down ms-1"></i>
            </a>
          </div>
          <div className="col-lg-6">
            <div className="card bg-white bg-opacity-10 border border-white border-opacity-25 rounded-3 p-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="rounded-circle bg-danger"
                  style={{ width: '10px', height: '10px', display: 'inline-block' }}
                ></span>
                <span
                  className="rounded-circle bg-warning"
                  style={{ width: '10px', height: '10px', display: 'inline-block' }}
                ></span>
                <span
                  className="rounded-circle bg-success"
                  style={{ width: '10px', height: '10px', display: 'inline-block' }}
                ></span>
                <small className="text-white-50 ms-2">OpsDrone</small>
              </div>
              <div className="bg-dark bg-opacity-25 rounded-2 p-3 font-monospace small text-white">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/nrj8at2HSTs"
                    title="Vídeo do YouTube"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <span className="badge bg-success">● Online</span>
                <span className="badge bg-secondary">v1.0.0-beta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
