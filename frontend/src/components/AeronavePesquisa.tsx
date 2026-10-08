// src/components/AeronavePesquisa.tsx
// Tela (modal) de pesquisa de aeronaves: por ID, Fabricante ou Número de Série.
//  - ID  → GET /api/aeronaves/:id
//  - Fabricante / Nº de série → GET /api/aeronaves (filtra no front-end)

import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../config'
import type {
  Aeronave,
  AeronavePesquisaProps,
  CriterioPesquisaAeronave,
} from '../types/aeronave'

const ROTULOS: Record<CriterioPesquisaAeronave, string> = {
  id: 'ID',
  fabricante: 'Fabricante',
  numeroSerie: 'Número de série',
}

function AeronavePesquisa({ onFechar, onSelecionar }: AeronavePesquisaProps) {
  const [criterio, setCriterio] = useState<CriterioPesquisaAeronave>('id')
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState<Aeronave[]>([])
  const [buscou, setBuscou] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')
  const termoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    termoRef.current?.focus()
  }, [])

  async function handlePesquisar(e: React.FormEvent) {
    e.preventDefault()
    if (buscando) return
    setErro('')

    const valor = termo.trim()
    if (!valor) {
      setErro(`Informe o ${ROTULOS[criterio]} para pesquisar.`)
      return
    }

    setBuscando(true)
    try {
      if (criterio === 'id') {
        const id = Number(valor)
        if (!Number.isInteger(id) || id <= 0) {
          setErro('ID inválido. Use um inteiro positivo.')
          return
        }
        const resp = await fetch(`${API_URL}/api/aeronaves/${id}`)
        if (resp.status === 404) {
          setResultados([])
        } else if (!resp.ok) {
          const corpo = await resp.json().catch(() => ({}))
          throw new Error(corpo.error || 'Erro ao buscar aeronave')
        } else {
          setResultados([(await resp.json()) as Aeronave])
        }
      } else {
        const resp = await fetch(`${API_URL}/api/aeronaves`)
        if (!resp.ok) {
          const corpo = await resp.json().catch(() => ({}))
          throw new Error(corpo.error || 'Erro ao listar aeronaves')
        }
        const todas = (await resp.json()) as Aeronave[]
        const busca = valor.toLowerCase()
        setResultados(todas.filter((a) => a[criterio].toLowerCase().includes(busca)))
      }
      setBuscou(true)
    } catch (err) {
      setResultados([])
      setBuscou(false)
      setErro(
        err instanceof TypeError
          ? 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.'
          : err instanceof Error
            ? err.message
            : 'Erro ao pesquisar.'
      )
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh', overflowY: 'auto' }}
      onClick={onFechar}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg overflow-hidden">
          <div className="modal-header bg-primary border-0 py-3">
            <h5 className="modal-title fw-bold w-100 text-center text-white mb-0">
              <i className="bi bi-search me-2"></i>Pesquisar Aeronave
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 me-3"
              aria-label="Fechar"
              onClick={onFechar}
            />
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handlePesquisar} noValidate>
              <div className="row g-3 align-items-end mb-3">
                <div className="col-md-4">
                  <label htmlFor="pesq-criterio" className="form-label fw-semibold">
                    Pesquisar por
                  </label>
                  <select
                    id="pesq-criterio"
                    className="form-select"
                    value={criterio}
                    onChange={(e) => {
                      setCriterio(e.target.value as CriterioPesquisaAeronave)
                      setTermo('')
                      setErro('')
                      setBuscou(false)
                      setResultados([])
                    }}
                  >
                    <option value="id">ID</option>
                    <option value="fabricante">Fabricante</option>
                    <option value="numeroSerie">Número de série</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label htmlFor="pesq-termo" className="form-label fw-semibold">
                    {ROTULOS[criterio]}
                  </label>
                  <input
                    ref={termoRef}
                    id="pesq-termo"
                    type={criterio === 'id' ? 'number' : 'text'}
                    min={criterio === 'id' ? 1 : undefined}
                    className="form-control"
                    placeholder={criterio === 'id' ? 'Ex: 1' : `Digite o ${ROTULOS[criterio].toLowerCase()}`}
                    value={termo}
                    onChange={(e) => {
                      setTermo(e.target.value)
                      if (erro) setErro('')
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={buscando}>
                    <i className="bi bi-search me-2"></i>
                    {buscando ? 'Pesquisando...' : 'Pesquisar'}
                  </button>
                </div>
              </div>
            </form>

            {erro && (
              <div className="alert alert-danger py-2 small" role="alert">
                {erro}
              </div>
            )}

            {buscou && resultados.length === 0 && !erro && (
              <div className="text-center text-secondary py-4">
                <i className="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                Nenhuma aeronave encontrada.
              </div>
            )}

            {resultados.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Fabricante</th>
                      <th>Modelo</th>
                      <th>Nº de série</th>
                      <th>Peso máx. decolagem</th>
                      <th>Código SISANT</th>
                      <th>Capacidade do tanque</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((a) => (
                      <tr key={a.id}>
                        <td className="fw-semibold">{a.id}</td>
                        <td>{a.fabricante}</td>
                        <td>{a.modelo}</td>
                        <td>{a.numeroSerie}</td>
                        <td>{a.pesoMaximoDecolagem}</td>
                        <td>{a.codigoSisant}</td>
                        <td>{a.capacidadeTanque}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => onSelecionar(a)}
                          >
                            Selecionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AeronavePesquisa
