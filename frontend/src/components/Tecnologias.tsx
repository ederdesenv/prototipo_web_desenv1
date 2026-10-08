const tecnologias = [
  { label: 'PHP',         classe: 'bg-danger'              },
  { label: 'TypeScript',  classe: 'bg-primary'             },
  { label: 'React 18',    classe: 'bg-info text-dark'      },
  { label: 'Node.js',     classe: 'bg-success'             },
  { label: 'Bootstrap 5', classe: 'bg-secondary'           },
  { label: 'Mysql',       classe: 'bg-primary'             },
  { label: 'Git & GitHub',classe: 'bg-dark'                },
]

function Tecnologias() {
  return (
    <section id="tecnologias" className="bg-light py-5">
      <div className="container">
        <p className="text-primary text-uppercase fw-bold small mb-1">Stack tecnológico</p>
        <h2 className="fw-bold text-dark mb-2">Tecnologias Utilizadas</h2>
        <p className="text-secondary mb-4">Stack moderna, escalável e amplamente adotada pelo Agro.</p>
        <div className="d-flex flex-wrap gap-2">
          {tecnologias.map((t) => (
            <span key={t.label} className={`badge ${t.classe} fs-6 fw-normal px-3 py-2`}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tecnologias
