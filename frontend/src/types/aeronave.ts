// src/types/aeronave.ts
// Tipagens do cadastro de aeronaves (espelham o model Aeronave do back-end)

/** Aeronave como devolvida pela API (Decimal do Prisma chega como string no JSON) */
export interface Aeronave {
  id: number
  fabricante: string
  modelo: string
  numeroSerie: string
  pesoMaximoDecolagem: string | number
  codigoSisant: string
  capacidadeTanque: string | number
  createdAt?: string
  updatedAt?: string
}

/** Campos do formulário (todos como texto; convertidos para número ao enviar) */
export interface AeronaveFormData {
  fabricante: string
  modelo: string
  numeroSerie: string
  pesoMaximoDecolagem: string
  codigoSisant: string
  capacidadeTanque: string
}

export type AeronaveErros = Partial<Record<keyof AeronaveFormData, string>>

export type CriterioPesquisaAeronave = 'id' | 'fabricante' | 'numeroSerie'

export interface AeronavePesquisaProps {
  onFechar: () => void
  onSelecionar: (aeronave: Aeronave) => void
}

export interface AeronaveFormProps {
  mostrarCabecalho?: boolean
}

export interface CadastrosMenuProps {
  onSelecionar: (cadastro: 'pilotos' | 'aeronaves') => void
}
