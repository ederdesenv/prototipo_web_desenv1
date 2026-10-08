// src/components/OrdemServicoForm.tsx

import { useState } from 'react'
import type { OrdemServicoFormData, OrdemServicoFormProps } from '../types/ordemServico'
import CatalogoDrones from './CatalogoDrones'
import type { Drone } from '../types/drone'

const FORM_VAZIO: OrdemServicoFormData = {
  cliente: '',
  tipoDocumento: '1', // '1' = CNPJ, '2' = CPF
  documento: '',
  clienteEndereco: '',
  propriedade: '',
  municipio: '',
  uf: '',
  dataAplicacao: '',
  servico: 'Herbicida',
  cultura: '',
  area: '',
  fabricante: '',
  aeronave: '',
  numeroIdentificacao: '',
  piloto: '',
  temperaturaAr: '',
  umidadeRelativa: '',
  velocidadeVento: '',
  observacoes: '',
}

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

function formatDocumento(value: string, tipo: string): string {
  const digits = value.replace(/\D/g, '')
  if (tipo === '2') {
    // CPF: 000.000.000-00
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  // CNPJ: 00.000.000/0000-00
  return digits
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

function OrdemServicoForm({
  mostrarCabecalho = true,
  mensagemSucesso = 'Ordem de Serviço gravada com sucesso!',
  onGravar,
  exibirAvisoObrigatorios = true,
}: OrdemServicoFormProps) {
  const [form, setForm] = useState<OrdemServicoFormData>(FORM_VAZIO)
  const [gravado, setGravado] = useState(false)
  const [erros, setErros] = useState<Partial<OrdemServicoFormData>>({})
  const [catalogoAberto, setCatalogoAberto] = useState(false)
  const [droneSelecionado, setDroneSelecionado] = useState<Drone | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erros[name as keyof OrdemServicoFormData]) {
      setErros((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleTipoDocumentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const tipo = e.target.value
    setForm((prev) => ({ ...prev, tipoDocumento: tipo, documento: formatDocumento(prev.documento, tipo) }))
  }

  function handleDocumentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value
    setForm((prev) => ({ ...prev, documento: formatDocumento(valor, prev.tipoDocumento) }))
  }

  function validar(): boolean {
    const novosErros: Partial<OrdemServicoFormData> = {}
    if (!form.cliente.trim())    novosErros.cliente       = 'Informe o cliente.'
    if (!form.dataAplicacao)     novosErros.dataAplicacao = 'Informe a data de aplicação.'
    if (!form.cultura.trim())    novosErros.cultura       = 'Informe a cultura.'
    if (!form.area.trim())       novosErros.area          = 'Informe a área.'
    if (!form.aeronave.trim())   novosErros.aeronave      = 'Informe a aeronave.'
    if (!form.piloto.trim())     novosErros.piloto        = 'Informe o piloto.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    onGravar?.(form)
    setGravado(true)
    setForm(FORM_VAZIO)
    setDroneSelecionado(null)
  }

  function handleNova() {
    setGravado(false)
    setErros({})
  }

  function handleSelecionarDrone(drone: Drone) {
    setDroneSelecionado(drone)
    // Preenche automaticamente o campo Aeronave
    setForm((prev) => ({ ...prev, aeronave: `${drone.nome} – ${drone.modelo}` }))
    if (erros.aeronave) setErros((prev) => ({ ...prev, aeronave: '' }))
    setCatalogoAberto(false)
  }

  if (gravado) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card shadow border-top border-success border-3 p-4">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
              <h4 className="fw-bold text-success mb-2">{mensagemSucesso}</h4>
              <p className="text-secondary mb-4">Os dados foram registrados no sistema.</p>
              <button className="btn btn-success" onClick={handleNova}>
                <i className="bi bi-plus-circle me-2"></i>Nova Ordem de Serviço
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Catálogo de Drones (modal) */}
      {catalogoAberto && (
        <CatalogoDrones
          onFechar={() => setCatalogoAberto(false)}
          onSelecionar={handleSelecionarDrone}
        />
      )}

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {mostrarCabecalho && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-layout-text-sidebar-reverse text-primary fs-4"></i>
                  <span className="badge bg-primary-subtle text-primary">Cadastro</span>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Cadastro de Ordens de Serviço</h2>
                    <p className="text-secondary mb-0">
                      Preencha os campos abaixo para registrar uma nova Ordem de Serviço.
                    </p>
                  </div>
                </div>

                {/* Badge do drone selecionado */}
                {droneSelecionado && (
                  <div className="alert alert-primary d-flex align-items-center gap-2 py-2 mt-3 mb-0" role="alert">
                    <i className="bi bi-check-circle-fill"></i>
                    <small>
                      Drone selecionado: <strong>{droneSelecionado.nome} – {droneSelecionado.modelo}</strong>
                      <span className="ms-2 text-muted">({droneSelecionado.fabricante})</span>
                    </small>
                    <button
                      type="button"
                      className="btn-close ms-auto"
                      style={{ fontSize: '0.6rem' }}
                      aria-label="Remover seleção"
                      onClick={() => {
                        setDroneSelecionado(null)
                        setForm((prev) => ({ ...prev, aeronave: '' }))
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="card shadow border-top border-primary border-3">
              <div className="card-body p-4">

                {exibirAvisoObrigatorios && (
                  <div className="alert alert-info d-flex align-items-center gap-2 py-2 mb-4" role="alert">
                    <i className="bi bi-info-circle-fill"></i>
                    <small>Campos marcados com <span className="text-danger fw-bold">*</span> são obrigatórios.</small>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                  {/* 1 - Dados do Serviço */}
                  <h6 className="fw-bold text-primary mb-3">1 - Dados do Serviço</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="dataAplicacao" className="form-label fw-semibold">
                        Data da Aplicação <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date" id="dataAplicacao" name="dataAplicacao"
                        className={`form-control ${erros.dataAplicacao ? 'is-invalid' : ''}`}
                        value={form.dataAplicacao} onChange={handleChange}
                      />
                      {erros.dataAplicacao && <div className="invalid-feedback">{erros.dataAplicacao}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="servico" className="form-label fw-semibold">
                        Tipo de Serviço <span className="text-danger">*</span>
                      </label>
                      <select
                        id="servico" name="servico"
                        className="form-select"
                        value={form.servico} onChange={handleChange}
                      >
                        <option>Herbicida</option>
                        <option>Fungicida</option>
                        <option>Inseticida</option>
                        <option>Adubação foliar</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="cultura" className="form-label fw-semibold">
                        Cultura <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text" id="cultura" name="cultura"
                        className={`form-control ${erros.cultura ? 'is-invalid' : ''}`}
                        placeholder="Ex: Soja, Milho, Café..."
                        value={form.cultura} onChange={handleChange}
                      />
                      {erros.cultura && <div className="invalid-feedback">{erros.cultura}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="area" className="form-label fw-semibold">
                        Área (ha) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="number" id="area" name="area"
                          className={`form-control ${erros.area ? 'is-invalid' : ''}`}
                          placeholder="0,00" min="0" step="0.01"
                          value={form.area} onChange={handleChange}
                        />
                        <span className="input-group-text">ha</span>
                        {erros.area && <div className="invalid-feedback">{erros.area}</div>}
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* 2 - Dados do Cliente */}
                  <h6 className="fw-bold text-primary mb-3">2 - Dados do Cliente</h6>
                  <div className="row g-3 mb-3 align-items-end">
                    <div className="col-md-6">
                      <span className="form-label fw-semibold d-block">Tipo de Documento</span>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input" type="radio" name="tipoDocumento"
                            id="tipoDocumentoCnpj" value="1"
                            checked={form.tipoDocumento === '1'}
                            onChange={handleTipoDocumentoChange}
                          />
                          <label className="form-check-label" htmlFor="tipoDocumentoCnpj">
                            1 - CNPJ
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input" type="radio" name="tipoDocumento"
                            id="tipoDocumentoCpf" value="2"
                            checked={form.tipoDocumento === '2'}
                            onChange={handleTipoDocumentoChange}
                          />
                          <label className="form-check-label" htmlFor="tipoDocumentoCpf">
                            2 - CPF
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="documento" className="form-label fw-semibold">
                        {form.tipoDocumento === '2' ? 'CPF' : 'CNPJ'}
                      </label>
                      <input
                        type="text" id="documento" name="documento"
                        className="form-control"
                        placeholder={form.tipoDocumento === '2' ? '000.000.000-00' : '00.000.000/0001-00'}
                        value={form.documento} onChange={handleDocumentoChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12">
                      <label htmlFor="cliente" className="form-label fw-semibold">
                        Cliente/Fazenda <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text" id="cliente" name="cliente"
                        className={`form-control ${erros.cliente ? 'is-invalid' : ''}`}
                        placeholder="Nome do cliente ou fazenda"
                        value={form.cliente} onChange={handleChange}
                      />
                      {erros.cliente && <div className="invalid-feedback">{erros.cliente}</div>}
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label htmlFor="clienteEndereco" className="form-label fw-semibold">
                        Endereço do Cliente
                      </label>
                      <input
                        type="text" id="clienteEndereco" name="clienteEndereco"
                        className="form-control"
                        placeholder="Rodovia, km..."
                        value={form.clienteEndereco} onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="propriedade" className="form-label fw-semibold">
                        Propriedade
                      </label>
                      <input
                        type="text" id="propriedade" name="propriedade"
                        className="form-control"
                        placeholder="Nome da propriedade"
                        value={form.propriedade} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="uf" className="form-label fw-semibold">
                        UF
                      </label>
                      <select
                        id="uf" name="uf"
                        className="form-select"
                        value={form.uf} onChange={handleChange}
                      >
                        <option value="">UF</option>
                        {ESTADOS_BR.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="municipio" className="form-label fw-semibold">
                        Município
                      </label>
                      <input
                        type="text" id="municipio" name="municipio"
                        className="form-control"
                        placeholder="Cidade"
                        value={form.municipio} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* 3 - Dados da Aeronave */}
                  <h6 className="fw-bold text-primary mb-3">3 - Dados da Aeronave</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="aeronave" className="form-label fw-semibold">
                        Aeronave <span className="text-danger">*</span>
                        <button
                          type="button"
                          className="btn btn-link btn-sm py-0 ps-2 text-success text-decoration-none"
                          onClick={() => setCatalogoAberto(true)}
                          title="Selecionar no catálogo"
                        >
                          <i className="bi bi-airplane me-1"></i>
                          <strong>Ver catálogo</strong>
                        </button>
                      </label>
                      <div className="row g-2">
                        <div className="col-5">
                          <select
                            id="fabricante" name="fabricante"
                            className="form-select"
                            value={form.fabricante} onChange={handleChange}
                          >
                            <option value="">Fabricante</option>
                            <option>Gteex</option>
                            <option>DJI</option>
                            <option>XAG</option>
                          </select>
                        </div>
                        <div className="col-7">
                          <input
                            type="text" id="aeronave" name="aeronave"
                            className={`form-control ${erros.aeronave ? 'is-invalid' : ''}`}
                            placeholder="Modelo / prefixo do drone"
                            value={form.aeronave} onChange={handleChange}
                          />
                        </div>
                      </div>
                      {erros.aeronave && <div className="text-danger small mt-1">{erros.aeronave}</div>}
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="piloto" className="form-label fw-semibold">
                        Piloto <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text" id="piloto" name="piloto"
                        className={`form-control ${erros.piloto ? 'is-invalid' : ''}`}
                        placeholder="Nome do piloto responsável"
                        value={form.piloto} onChange={handleChange}
                      />
                      {erros.piloto && <div className="invalid-feedback">{erros.piloto}</div>}
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="numeroIdentificacao" className="form-label fw-semibold">
                        Número de Identificação
                      </label>
                      <input
                        type="text" id="numeroIdentificacao" name="numeroIdentificacao"
                        className="form-control"
                        placeholder="Nº de registro / série"
                        value={form.numeroIdentificacao} onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* 4 - Índice Delta T */}
                  <div className="bg-success bg-opacity-10 border border-success-subtle rounded-3 p-3 mb-4">
                    <h6 className="fw-bold text-primary mb-3">4 - Índice Delta T</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label htmlFor="temperaturaAr" className="form-label fw-semibold">
                          Temperatura do Ar (°C)
                        </label>
                        <input
                          type="number" id="temperaturaAr" name="temperaturaAr"
                          className="form-control" step="0.1" placeholder="0,0"
                          value={form.temperaturaAr} onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="umidadeRelativa" className="form-label fw-semibold">
                          Umidade Relativa (%)
                        </label>
                        <input
                          type="number" id="umidadeRelativa" name="umidadeRelativa"
                          className="form-control" step="0.1" placeholder="0,0"
                          value={form.umidadeRelativa} onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="velocidadeVento" className="form-label fw-semibold">
                          Velocidade do Vento (km/h)
                        </label>
                        <input
                          type="number" id="velocidadeVento" name="velocidadeVento"
                          className="form-control" step="0.1" placeholder="0,0"
                          value={form.velocidadeVento} onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="observacoes" className="form-label fw-semibold">
                      Observações
                    </label>
                    <textarea
                      id="observacoes" name="observacoes"
                      className="form-control" rows={3}
                      placeholder="Informações adicionais sobre a ordem de serviço..."
                      value={form.observacoes} onChange={handleChange}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2">
                    {form.fabricante === 'Gteex' ? (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-camera-video me-2"></i>Log de Voo
                      </button>
                    ) : (
                      <span />
                    )}
                    <div className="d-flex gap-2">
                      <button
                        type="button" className="btn btn-outline-secondary"
                        onClick={() => { setForm(FORM_VAZIO); setErros({}); setDroneSelecionado(null) }}
                      >
                        <i className="bi bi-x-circle me-1"></i>Limpar
                      </button>
                      <button type="submit" className="btn btn-success fw-semibold px-4">
                        <i className="bi bi-floppy me-2"></i>Gravar Ordem de Serviço
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrdemServicoForm
