// modules/cep/domain/entities/Address.ts

export interface Address {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}