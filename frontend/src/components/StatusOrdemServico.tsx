// src/components/StatusOrdemServico.tsx
//
// Tela "Status da Ordem de Serviço" (card 'Status OS' em Funcionalidades).
// Segue o mesmo padrão visual do OrdemServicoForm.tsx (Bootstrap + bi-icons).
// A busca abaixo usa dados mock apenas para demonstrar o fluxo — quando o
// backend/API de status estiver disponível, troque a função `buscarStatusMock`
// pela chamada real (fetch/axios) mantendo a mesma assinatura de retorno.

import { useState } from 'react'

type EtapaChave = 'recebida' | 'analise' | 'aprovada' | 'execucao' | 'concluida'

interface ResultadoOS {
  numero: string
  cliente: string
  cultura: string
  servico: string
  area: string
  dataAplicacao: string
  etapaAtual: EtapaChave
}

const ETAPAS: { chave: EtapaChave; label: string }[] = [
  { chave: 'recebida', label: 'Recebida' },
  { chave: 'analise', label: 'Em análise' },
  { chave: 'aprovada', label: 'Aprovada' },
  { chave: 'execucao', label: 'Em execução' },
  { chave: 'concluida', label: 'Concluída' },
]

// Mock temporário — substituir pela integração real com o backend.
const OS_MOCK: Record<string, ResultadoOS> = {
  'OS-0001': {
    numero: 'OS-0001',
    cliente: 'Fazenda Boa Vista',
    cultura: 'Soja',
    servico: 'Herbicida',
    area: '48,00',
    dataAplicacao: '18/08/2026',
    etapaAtual: 'execucao',
  },
}

function buscarStatusMock(numeroOS: string): Promise<ResultadoOS | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(OS_MOCK[numeroOS.trim().toUpperCase()] ?? null)
    }, 500)
  })
}

interface StatusOrdemServicoProps {
  mostrarCabecalho?: boolean
}

function StatusOrdemServico({ mostrarCabecalho = true }: StatusOrdemServicoProps) {
  const [tipoDocumento, setTipoDocumento] = useState('1') // '1' = CNPJ, '2' = CPF
  const [numeroOS, setNumeroOS] = useState('')
  const [documento, setDocumento] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoOS | null>(null)
  const [erro, setErro] = useState('')

  async function handlePesquisar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setResultado(null)

    if (!numeroOS.trim()) {
      setErro('Informe o número da Ordem de Serviço.')
      return
    }

    setBuscando(true)
    const encontrada = await buscarStatusMock(numeroOS)
    setBuscando(false)

    if (encontrada) {
      setResultado(encontrada)
    } else {
      setErro('Nenhuma Ordem de Serviço encontrada com esse número.')
    }
  }

  function handleLimpar() {
    setNumeroOS('')
    setDocumento('')
    setResultado(null)
    setErro('')
  }

  const indiceEtapaAtual = resultado
    ? ETAPAS.findIndex((etapa) => etapa.chave === resultado.etapaAtual)
    : -1

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          {mostrarCabecalho && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-shield-lock text-success fs-4"></i>
                <span className="badge bg-success-subtle text-success">Status OS</span>
              </div>
              <h2 className="fw-bold text-dark mb-1">Status da Ordem de Serviço</h2>
              <p className="text-secondary mb-0">
                Pesquise pelo número da OS para acompanhar o status do serviço.
              </p>
            </div>
          )}

          <div className="card shadow border-top border-success border-3">
            <div className="card-body p-4">

              <div className="alert alert-info d-flex align-items-center gap-2 py-2 mb-4" role="alert">
                <i className="bi bi-info-circle-fill"></i>
                <small>Campos marcados com <span className="text-danger fw-bold">*</span> são obrigatórios.</small>
              </div>

              <form onSubmit={handlePesquisar} noValidate>

                <h6 className="fw-bold text-success mb-3">1 - Pesquisar Ordem de Serviço</h6>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="numeroOS" className="form-label fw-semibold">
                      Número da OS <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-search"></i></span>
                      <input
                        type="text" id="numeroOS" name="numeroOS"
                        className={`form-control ${erro ? 'is-invalid' : ''}`}
                        placeholder="Ex: OS-0001"
                        value={numeroOS}
                        onChange={(e) => { setNumeroOS(e.target.value); setErro('') }}
                      />
                      {erro && <div className="invalid-feedback">{erro}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <span className="form-label fw-semibold d-block">Tipo de Documento</span>
                    <div className="d-flex gap-3 pt-1">
                      <div className="form-check">
                        <input
                          className="form-check-input" type="radio" name="tipoDocumento"
                          id="tipoDocCnpj" value="1"
                          checked={tipoDocumento === '1'}
                          onChange={(e) => setTipoDocumento(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="tipoDocCnpj">1 - CNPJ</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input" type="radio" name="tipoDocumento"
                          id="tipoDocCpf" value="2"
                          checked={tipoDocumento === '2'}
                          onChange={(e) => setTipoDocumento(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="tipoDocCpf">2 - CPF</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="documento" className="form-label fw-semibold">
                      {tipoDocumento === '2' ? 'CPF' : 'CNPJ'}{' '}
                      <span className="text-secondary fw-normal">(opcional)</span>
                    </label>
                    <input
                      type="text" id="documento" name="documento"
                      className="form-control"
                      placeholder={tipoDocumento === '2' ? '000.000.000-00' : '00.000.000/0001-00'}
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button" className="btn btn-outline-secondary"
                    onClick={handleLimpar}
                  >
                    <i className="bi bi-x-circle me-1"></i>Limpar
                  </button>
                  <button type="submit" className="btn btn-success fw-semibold px-4" disabled={buscando}>
                    <i className="bi bi-search me-2"></i>{buscando ? 'Pesquisando...' : 'Pesquisar'}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {resultado && (
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <h5 className="fw-bold mb-0">{resultado.numero}</h5>
                  <span className="badge bg-success-subtle text-success">
                    {ETAPAS[indiceEtapaAtual].label}
                  </span>
                </div>

                <div className="row g-2 small mb-4">
                  <div className="col-md-6 d-flex justify-content-between border-bottom py-1">
                    <span className="text-secondary">Cliente/Fazenda:</span>
                    <span className="fw-semibold">{resultado.cliente}</span>
                  </div>
                  <div className="col-md-6 d-flex justify-content-between border-bottom py-1">
                    <span className="text-secondary">Cultura:</span>
                    <span className="fw-semibold">{resultado.cultura}</span>
                  </div>
                  <div className="col-md-6 d-flex justify-content-between border-bottom py-1">
                    <span className="text-secondary">Tipo de Serviço:</span>
                    <span className="fw-semibold">{resultado.servico}</span>
                  </div>
                  <div className="col-md-6 d-flex justify-content-between border-bottom py-1">
                    <span className="text-secondary">Área:</span>
                    <span className="fw-semibold">{resultado.area} ha</span>
                  </div>
                  <div className="col-md-6 d-flex justify-content-between border-bottom py-1">
                    <span className="text-secondary">Data da Aplicação:</span>
                    <span className="fw-semibold">{resultado.dataAplicacao}</span>
                  </div>
                </div>

                <h6 className="fw-bold text-success mb-3">Andamento</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {ETAPAS.map((etapa, i) => {
                    const concluida = i < indiceEtapaAtual
                    const atual = i === indiceEtapaAtual
                    const icone = concluida
                      ? 'bi-check-circle-fill text-success'
                      : atual
                      ? 'bi-clock-fill text-primary'
                      : 'bi-circle text-secondary opacity-50'
                    return (
                      <li key={etapa.chave} className="d-flex align-items-center gap-2">
                        <i className={`bi ${icone}`}></i>
                        <span className={atual ? 'fw-semibold' : concluida ? '' : 'text-secondary'}>
                          {etapa.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default StatusOrdemServico
