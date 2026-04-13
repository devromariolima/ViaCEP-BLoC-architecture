// modules/cep/data/dtos/ViaCepResponse.ts

export interface ViaCepResponse {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}