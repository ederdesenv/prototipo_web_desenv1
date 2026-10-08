// src/types/ordemServico.ts

export interface OrdemServicoFormData {
  cliente: string
  tipoDocumento: string
  documento: string
  clienteEndereco: string
  propriedade: string
  municipio: string
  uf: string
  dataAplicacao: string
  servico: string
  cultura: string
  area: string
  fabricante: string
  aeronave: string
  numeroIdentificacao: string
  piloto: string
  temperaturaAr: string
  umidadeRelativa: string
  velocidadeVento: string
  observacoes: string
}

export interface OrdemServicoFormProps {
  mostrarCabecalho?: boolean
  mensagemSucesso?: string
  onGravar?: (dados: OrdemServicoFormData) => void
  exibirAvisoObrigatorios?: boolean
}

export interface CardFuncionalidade {
  category: string
  badge: string
  badgeClass: string
  iconClass: string
  iconColor: string
  title: string
  description: string
  btnClass: string
  btnLabel: string
  borderColor: string
}