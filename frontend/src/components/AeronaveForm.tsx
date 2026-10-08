// src/components/AeronaveForm.tsx
// Cadastro de Aeronaves — telas Incluir / Alterar / Deletar / Pesquisar.
// As regras vêm do back-end (server.ts):
//   POST   /api/aeronaves        (exige login) → Incluir
//   PUT    /api/aeronaves/:id    (exige login) → Alterar
//   DELETE /api/aeronaves/:id    (exige login) → Deletar
//   GET    /api/aeronaves[/:id]  (público)     → Pesquisar
// A validação abaixo espelha o schema zod (createAeronaveSchema) para avisar
// o usuário antes de enviar; o servidor continua sendo a palavra final.

import { useState } from 'react'
import { API_URL } from '../config'
import { useAuth } from '../Contexts/AuthContext'
import AeronavePesquisa from './AeronavePesquisa'
import type {
  Aeronave,
  AeronaveErros,
  AeronaveFormData,
  AeronaveFormProps,
} from '../types/aeronave'

const FORM_VAZIO: AeronaveFormData = {
  fabricante: '',
  modelo: '',
  numeroSerie: '',
  pesoMaximoDecolagem: '',
  codigoSisant: '',
  capacidadeTanque: '',
}

interface Feedback {
  tipo: 'sucesso' | 'erro'
  texto: string
  id?: number
}

function aeronaveParaForm(a: Aeronave): AeronaveFormData {
  return {
    fabricante: a.fabricante,
    modelo: a.modelo,
    numeroSerie: a.numeroSerie,
    pesoMaximoDecolagem: String(a.pesoMaximoDecolagem),
    codigoSisant: a.codigoSisant,
    capacidadeTanque: String(a.capacidadeTanque),
  }
}

function AeronaveForm({ mostrarCabecalho = true }: AeronaveFormProps) {
  const { token, logout } = useAuth()

  const [form, setForm] = useState<AeronaveFormData>(FORM_VAZIO)
  const [erros, setErros] = useState<AeronaveErros>({})
  // ID da aeronave carregada (via Pesquisar). null = cadastro novo.
  const [aeronaveId, setAeronaveId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [pesquisaAberta, setPesquisaAberta] = useState(false)
  const [processando, setProcessando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (erros[name as keyof AeronaveFormData]) {
      setErros((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ── Mesmas regras do zod (createAeronaveSchema) ──────────────────────────
  function validar(): boolean {
    const novos: AeronaveErros = {}
    if (form.fabricante.trim().length < 3) novos.fabricante = 'Fabricante deve ter pelo menos 3 caracteres'
    if (!form.modelo.trim()) novos.modelo = 'Modelo não pode ser vazio'
    if (!form.numeroSerie.trim()) novos.numeroSerie = 'Número de série não pode ser vazio'
    const peso = Number(form.pesoMaximoDecolagem)
    if (!form.pesoMaximoDecolagem.trim() || !(peso > 0)) {
      novos.pesoMaximoDecolagem = 'Peso máximo de decolagem deve ser maior que zero'
    }
    if (!form.codigoSisant.trim()) novos.codigoSisant = 'Código SISANT não pode ser vazio'
    const cap = Number(form.capacidadeTanque)
    if (!form.capacidadeTanque.trim() || !(cap > 0)) {
      novos.capacidadeTanque = 'Capacidade do tanque deve ser maior que zero'
    }
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  function corpoRequisicao() {
    return {
      fabricante: form.fabricante.trim(),
      modelo: form.modelo.trim(),
      numeroSerie: form.numeroSerie.trim(),
      pesoMaximoDecolagem: Number(form.pesoMaximoDecolagem),
      codigoSisant: form.codigoSisant.trim(),
      capacidadeTanque: Number(form.capacidadeTanque),
    }
  }

  // Incluir/Alterar/Deletar exigem usuário logado (authMiddleware do back-end)
  function exigeLogin(): boolean {
    if (!token) {
      setFeedback({
        tipo: 'erro',
        texto: 'Faça login para incluir, alterar ou deletar aeronaves.',
      })
      return false
    }
    return true
  }

  // Chamada comum à API protegida; devolve o corpo JSON ou lança Error com a mensagem do servidor
  async function chamarApi(url: string, metodo: 'POST' | 'PUT' | 'DELETE', corpo?: unknown) {
    let resp: Response
    try {
      resp = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: corpo ? JSON.stringify(corpo) : undefined,
      })
    } catch {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o back-end está rodando.')
    }

    const dados = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      if (resp.status === 401) {
        logout()
        throw new Error('Sessão expirada ou inválida. Faça login novamente.')
      }
      throw new Error(dados.error || 'Erro ao processar a solicitação.')
    }
    return dados
  }

  // ── [Incluir] ────────────────────────────────────────────────────────────
  async function handleIncluir(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    if (!exigeLogin() || !validar()) return

    setProcessando(true)
    try {
      const dados = await chamarApi(`${API_URL}/api/aeronaves`, 'POST', corpoRequisicao())
      setFeedback({
        tipo: 'sucesso',
        texto: 'Aeronave cadastrada com Sucesso',
        id: dados.aeronave.id,
      })
      setForm(FORM_VAZIO)
      setErros({})
    } catch (err) {
      setFeedback({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro ao cadastrar aeronave.' })
    } finally {
      setProcessando(false)
    }
  }

  // ── [Alterar] ────────────────────────────────────────────────────────────
  async function handleAlterar() {
    setFeedback(null)
    if (aeronaveId === null) {
      setFeedback({ tipo: 'erro', texto: 'Use o botão Pesquisar para escolher a aeronave que deseja alterar.' })
      return
    }
    if (!exigeLogin() || !validar()) return

    setProcessando(true)
    try {
      await chamarApi(`${API_URL}/api/aeronaves/${aeronaveId}`, 'PUT', corpoRequisicao())
      setFeedback({ tipo: 'sucesso', texto: 'Aeronave atualizada com Sucesso', id: aeronaveId })
    } catch (err) {
      setFeedback({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro ao atualizar aeronave.' })
    } finally {
      setProcessando(false)
    }
  }

  // ── [Deletar] ────────────────────────────────────────────────────────────
  async function handleDeletar() {
    setFeedback(null)
    if (aeronaveId === null) {
      setFeedback({ tipo: 'erro', texto: 'Use o botão Pesquisar para escolher a aeronave que deseja deletar.' })
      return
    }
    if (!exigeLogin()) return
    if (!window.confirm(`Deseja realmente deletar a aeronave de ID ${aeronaveId}?`)) return

    setProcessando(true)
    try {
      await chamarApi(`${API_URL}/api/aeronaves/${aeronaveId}`, 'DELETE')
      setFeedback({ tipo: 'sucesso', texto: 'Aeronave deletada com Sucesso', id: aeronaveId })
      setForm(FORM_VAZIO)
      setErros({})
      setAeronaveId(null)
    } catch (err) {
      setFeedback({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro ao deletar aeronave.' })
    } finally {
      setProcessando(false)
    }
  }

  // ── [Pesquisar] → carrega a aeronave escolhida no formulário ─────────────
  function handleSelecionar(a: Aeronave) {
    setForm(aeronaveParaForm(a))
    setAeronaveId(a.id)
    setErros({})
    setFeedback(null)
    setPesquisaAberta(false)
  }

  function handleLimpar() {
    setForm(FORM_VAZIO)
    setErros({})
    setAeronaveId(null)
    setFeedback(null)
  }

  function campo(
    name: keyof AeronaveFormData,
    rotulo: string,
    opcoes: { type?: string; placeholder?: string; colClass?: string } = {}
  ) {
    const { type = 'text', placeholder, colClass = 'col-md-6' } = opcoes
    return (
      <div className={colClass}>
        <label htmlFor={name} className="form-label fw-semibold">
          {rotulo} <span className="text-danger">*</span>
        </label>
        <input
          type={type}
          id={name}
          name={name}
          className={`form-control ${erros[name] ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' ? '0.01' : undefined}
          value={form[name]}
          onChange={handleChange}
        />
        {erros[name] && <div className="invalid-feedback">{erros[name]}</div>}
      </div>
    )
  }

  return (
    <>
      {pesquisaAberta && (
        <AeronavePesquisa
          onFechar={() => setPesquisaAberta(false)}
          onSelecionar={handleSelecionar}
        />
      )}

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {mostrarCabecalho && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-airplane text-primary fs-4"></i>
                  <span className="badge bg-primary-subtle text-primary">Cadastro</span>
                </div>
                <h2 className="fw-bold text-dark mb-1">Cadastro de Aeronaves</h2>
                <p className="text-secondary mb-0">
                  Preencha os campos e use Incluir. Para alterar ou deletar, localize a aeronave com Pesquisar.
                </p>
              </div>
            )}

            <div className="card shadow border-top border-primary border-3">
              <div className="card-body p-4">
                {feedback && (
                  <div
                    className={`alert ${feedback.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'} d-flex align-items-start gap-2`}
                    role="alert"
                  >
                    <i
                      className={`bi ${feedback.tipo === 'sucesso' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} mt-1`}
                    ></i>
                    <div className="flex-grow-1">
                      <strong>{feedback.texto}</strong>
                      {feedback.id !== undefined && (
                        <div>
                          ID da aeronave: <strong data-testid="aeronave-id">{feedback.id}</strong>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Fechar"
                      onClick={() => setFeedback(null)}
                    />
                  </div>
                )}

                {aeronaveId !== null && (
                  <div className="alert alert-primary d-flex align-items-center gap-2 py-2" role="alert">
                    <i className="bi bi-pencil-square"></i>
                    <small>
                      Editando a aeronave de ID <strong>{aeronaveId}</strong>. Use Alterar ou Deletar, ou Limpar
                      para iniciar um novo cadastro.
                    </small>
                  </div>
                )}

                <div className="alert alert-info d-flex align-items-center gap-2 py-2 mb-4" role="alert">
                  <i className="bi bi-info-circle-fill"></i>
                  <small>
                    Campos marcados com <span className="text-danger fw-bold">*</span> são obrigatórios.
                  </small>
                </div>

                <form onSubmit={handleIncluir} noValidate>
                  <h6 className="fw-bold text-primary mb-3">Dados da Aeronave</h6>

                  <div className="row g-3 mb-3">
                    {campo('fabricante', 'Fabricante', { placeholder: 'Ex: DJI, XAG, Gteex' })}
                    {campo('modelo', 'Modelo', { placeholder: 'Modelo da aeronave' })}
                  </div>

                  <div className="row g-3 mb-3">
                    {campo('numeroSerie', 'Número de Série', { placeholder: 'Número de série' })}
                    {campo('codigoSisant', 'Código SISANT', { placeholder: 'Código SISANT' })}
                  </div>

                  <div className="row g-3 mb-4">
                    {campo('pesoMaximoDecolagem', 'Peso Máximo de Decolagem', { type: 'number', placeholder: '0,00' })}
                    {campo('capacidadeTanque', 'Capacidade do Tanque', { type: 'number', placeholder: '0,00' })}
                  </div>

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleLimpar}
                      disabled={processando}
                    >
                      <i className="bi bi-x-circle me-1"></i>Limpar
                    </button>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="btn btn-success fw-semibold px-4"
                        disabled={processando || aeronaveId !== null}
                        title={aeronaveId !== null ? 'Clique em Limpar para incluir uma nova aeronave' : undefined}
                      >
                        <i className="bi bi-plus-circle me-2"></i>Incluir
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary fw-semibold px-4"
                        onClick={handleAlterar}
                        disabled={processando || aeronaveId === null}
                        title={aeronaveId === null ? 'Pesquise e selecione uma aeronave primeiro' : undefined}
                      >
                        <i className="bi bi-pencil me-2"></i>Alterar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger fw-semibold px-4"
                        onClick={handleDeletar}
                        disabled={processando || aeronaveId === null}
                        title={aeronaveId === null ? 'Pesquise e selecione uma aeronave primeiro' : undefined}
                      >
                        <i className="bi bi-trash me-2"></i>Deletar
                      </button>
                      <button
                        type="button"
                        className="btn btn-warning fw-semibold px-4"
                        onClick={() => setPesquisaAberta(true)}
                        disabled={processando}
                      >
                        <i className="bi bi-search me-2"></i>Pesquisar
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

export default AeronaveForm
