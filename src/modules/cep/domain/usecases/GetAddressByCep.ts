// modules/cep/domain/usecases/GetAddressByCep.ts

import type { Address } from '../entities/Address'
import type { AddressRepository } from '../repositories/AddressRepository'

export class GetAddressByCep {
  constructor(private repository: AddressRepository) {}

  async execute(cep: string): Promise<Address> {
    if (!cep || cep.length !== 8) {
      throw new Error('CEP inválido')
    }

    return this.repository.getAddressByCep(cep)
  }
}