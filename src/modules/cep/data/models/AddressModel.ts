// modules/cep/data/models/AddressModel.ts

import type { Address } from '../../domain/entities/Address'
import type { ViaCepResponse } from '../dtos/ViaCepResponse'

export class AddressModel {
  static fromJson(json: ViaCepResponse): Address {
    return {
      cep: json.cep,
      logradouro: json.logradouro,
      bairro: json.bairro,
      localidade: json.localidade,
      uf: json.uf
    }
  }
}