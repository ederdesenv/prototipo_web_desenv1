// src/components/CatalogoDrones.tsx

import { useState } from 'react'
import type { Drone, CatalogoDronesProps, DroneCardProps } from '../types/drone'

// ── Dados iniciais do catálogo ────────────────────────────────────────────────
const DRONES_INICIAIS: Drone[] = [
{
    id: 1,
    nome: 'Drone 1',
    modelo: 'Agras T40',
    fabricante: 'DJI',
    capacidade: '40 L / 40 kg',        
    autonomia: '~18 min',               
    velocidade: '10 m/s',
    categoria: 'Pulverização',
    tags: ['pulverização', 'agrícola', 'octacóptero', 'DJI'],  
    imagem: 'drones/drone_1.jpg',
    descricao:
      'Drone agrícola de alto desempenho com tanque de 40 L, duplo sistema de atomização e radar omnidirecional para pulverização de precisão em lavouras de grande porte.',
    cultura:'Grandes lavouras: soja, milho, arroz,trigo.Pomares e fruticultura: laranja, maçã, uva, café. Hortaliças e vegetais: tomate, batata, alface.'
  },
  {
    id: 2,
    nome: 'Drone 2',
    modelo: 'Agras T50',
    fabricante: 'DJI',
    capacidade: '40 L / 40 kg',        
    autonomia: '~20 min',              
    velocidade: '12 m/s',              
    categoria: 'Pulverização',
    tags: ['pulverização', 'agrícola', 'octacóptero', 'DJI'],  
    imagem: 'drones/drone_2.jpg',
    descricao:
      'Octacóptero agrícola de alto desempenho com tanque de 40 L para pulverização e capacidade de dispersão de até 75 L, ideal para operações extensivas em terrenos planos e acidentados.',
    cultura:'Cultivos extensivos: cana-de-açúcar, soja, milho, algodão. Pastagens e silvicultura: reflorestamento e manutenção de áreas de pasto.'      
  },
  {
    id: 3,
    nome: 'Drone 3',
    modelo: 'MG-1P',
    fabricante: 'DJI',
    capacidade: '10 L',
    autonomia: '~13 min',              
    velocidade: '7 m/s',
    categoria: 'Pulverização',
    tags: ['pulverização', 'compacto', 'octacóptero', 'DJI'],
    imagem: 'drones/drone_3.jpg',
    descricao:
      'Drone compacto e resistente para pulverização agrícola em áreas menores. Equipado com sistema inteligente de controle de vazão e modo de operação autônoma.',
    cultura:'Pequenas e médias propriedades: hortaliças, arroz, milho, soja em menor escala. Cultivos especializados: chá, flores e culturas de alto valor agregado.'      
  },
  {
    id: 4,
    nome: 'Drone 4',
    modelo: 'EAgricultural V40',
    fabricante: 'XAG',
    capacidade: '40 L',
    autonomia: '~20 min',
    velocidade: '8 m/s',
    categoria: 'Multifunção',
    tags: ['pulverização', 'semeadura', 'hexacóptero', 'XAG'],
    imagem: 'drones/drone_4.jpg',
    descricao:
      'Drone multifuncional para pulverização e semeadura com sistema inteligente de desvio de obstáculos e planejamento automático de rotas por satélite.',
    cultura:'Arroz e hortaliças → precisão em lavouras densas.Fruticultura (laranja, café, uva) → pulverização direcionada em árvores.Algodão, soja e milho → eficiência em áreas extensivas. Cultivos especiais (chá, flores) → monitoramento inteligente e aplicação controlada.'      
  },
]

// ── DroneCard ─────────────────────────────────────────────────────────────────
function DroneCard({ drone, onSelecionar }: DroneCardProps) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="col-sm-6 col-lg-3">
      <div
        className="card h-100 shadow-sm border-0"
        style={{ borderTop: '3px solid #0d6efd', borderRadius: '10px', overflow: 'hidden' }}
      >
        {/* Imagem */}
        <div
          style={{
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            overflow: 'hidden',
          }}
        >
          <img
            src={drone.imagem}
            alt={`${drone.nome} – ${drone.modelo}`}
            style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>

        <div className="card-body d-flex flex-column p-3">
          {/* Badge categoria */}
          <span className="badge bg-primary-subtle text-primary align-self-start mb-2 small">
            {drone.categoria}
          </span>

          {/* Nome e modelo */}
          <h6 className="fw-bold mb-0">{drone.nome}</h6>
          <p className="text-secondary small mb-2">{drone.modelo} — {drone.fabricante}</p>

          {/* Especificações */}
          <ul className="list-unstyled small mb-2">
            <li>
              <i className="bi bi-droplet-fill text-primary me-1"></i>
              <strong>Capacidade:</strong> {drone.capacidade}
            </li>
            <li>
              <i className="bi bi-battery-half text-success me-1"></i>
              <strong>Autonomia:</strong> {drone.autonomia}
            </li>
            <li>
              <i className="bi bi-speedometer2 text-warning me-1"></i>
              <strong>Velocidade:</strong> {drone.velocidade}
            </li>
            <li>
              <i className="bi bi-tree text-success me-1"></i>
              <strong>Cultura:</strong> {drone.cultura}
            </li>            
          </ul>

          {/* Tags */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            {drone.tags.map((tag) => (
              <span key={tag} className="badge bg-secondary bg-opacity-10 text-secondary small">
                #{tag}
              </span>
            ))}
          </div>

          {/* Descrição expansível */}
          <p className={`small text-secondary ${expandido ? '' : 'text-truncate'} mb-2`}
             style={expandido ? {} : { WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {drone.descricao}
          </p>
          <button
            className="btn btn-link p-0 text-decoration-none small mb-2 text-start"
            onClick={() => setExpandido((v) => !v)}
          >
            {expandido ? (
              <><i className="bi bi-chevron-up me-1"></i>Ver menos</>
            ) : (
              <><i className="bi bi-chevron-down me-1"></i>Ver mais</>
            )}
          </button>

          {/* Botão selecionar */}
          {onSelecionar && (
            <div className="mt-auto">
              <button
                className="btn btn-success btn-sm w-100"
                onClick={() => onSelecionar(drone)}
              >
                <i className="bi bi-check2-circle me-1"></i>Selecionar Drone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── CatalogoDrones (tela principal) ──────────────────────────────────────────
function CatalogoDrones({ onFechar, onSelecionar }: CatalogoDronesProps) {
  const [drones] = useState<Drone[]>(DRONES_INICIAIS)
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todos')

  // Categorias únicas para filtro rápido
  const categorias = ['Todos', ...Array.from(new Set(drones.map((d) => d.categoria)))]

  // Filtragem em tempo real
  const dronesFiltrados = drones.filter((drone) => {
    const busca = termoBusca.toLowerCase()
    const matchBusca =
      !termoBusca ||
      drone.nome.toLowerCase().includes(busca) ||
      drone.modelo.toLowerCase().includes(busca) ||
      drone.fabricante.toLowerCase().includes(busca) ||
      drone.categoria.toLowerCase().includes(busca) ||
      drone.tags.some((t) => t.toLowerCase().includes(busca)) ||
      drone.descricao.toLowerCase().includes(busca)

    const matchCategoria =
      categoriaFiltro === 'Todos' || drone.categoria === categoriaFiltro

    return matchBusca && matchCategoria
  })

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">

          {/* Header */}
          <div className="modal-header border-bottom py-3"
               style={{ background: '#198754' }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-airplane text-white fs-4"></i>
              <div>
                <h5 className="modal-title text-white fw-bold mb-0">
                  Catálogo de Drones
                </h5>
                <small className="text-white text-opacity-75">
                  Selecione o drone para a operação
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onFechar}
              aria-label="Fechar"
            />
          </div>

          {/* Barra de busca + filtros */}
          <div className="modal-header border-bottom bg-light py-3 flex-column align-items-stretch gap-2">
            {/* Campo de busca */}
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Buscar por nome, modelo, fabricante, categoria ou tag..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                autoFocus
              />
              {termoBusca && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  onClick={() => setTermoBusca('')}
                  title="Limpar busca"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {/* Filtros por categoria */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <small className="text-secondary me-1">Categoria:</small>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill ${
                    categoriaFiltro === cat ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={() => setCategoriaFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
              <span className="ms-auto text-secondary small">
                {dronesFiltrados.length} drone{dronesFiltrados.length !== 1 ? 's' : ''} encontrado{dronesFiltrados.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Body – Grid de cards */}
          <div className="modal-body" style={{ minHeight: '400px' }}>
            {dronesFiltrados.length > 0 ? (
              <div className="row g-3">
                {dronesFiltrados.map((drone) => (
                  <DroneCard
                    key={drone.id}
                    drone={drone}
                    onSelecionar={onSelecionar}
                  />
                ))}
              </div>
            ) : (
              /* Estado vazio */
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-secondary">
                <i className="bi bi-search fs-1 mb-3 opacity-25"></i>
                <h6 className="fw-semibold">Nenhum drone encontrado</h6>
                <p className="small text-center mb-3">
                  Nenhum resultado para <strong>"{termoBusca}"</strong>
                  {categoriaFiltro !== 'Todos' && (
                    <> na categoria <strong>{categoriaFiltro}</strong></>
                  )}.
                </p>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => { setTermoBusca(''); setCategoriaFiltro('Todos') }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top py-2">
            <small className="text-success me-auto d-flex flex-column">
              <span className="fw-bold mb-1">Fontes extraídas das páginas oficiais dos fabricantes de drones.</span>
              <span>
                <i className="bi bi-info-circle me-1"></i>
                Total no catálogo: {drones.length} drones
              </span>
            </small>
            <button className="btn btn-outline-success btn-sm" onClick={onFechar}>
              <i className="bi bi-x-circle me-1"></i>Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CatalogoDrones
