// src/types/drone.ts

export interface Drone {
  id: number
  nome: string
  modelo: string
  fabricante: string
  capacidade: string
  autonomia: string
  velocidade: string
  categoria: string
  tags: string[]
  imagem: string
  descricao: string
  cultura: string
}

export interface CatalogoDronesProps {
  onFechar: () => void
  onSelecionar?: (drone: Drone) => void
}

export interface DroneCardProps {
  drone: Drone
  onSelecionar?: (drone: Drone) => void
}
