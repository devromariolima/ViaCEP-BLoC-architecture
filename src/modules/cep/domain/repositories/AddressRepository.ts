// modules/cep/domain/repositories/AddressRepository.ts

import type { Address } from '../entities/Address'

export interface AddressRepository {
  getAddressByCep(cep: string): Promise<Address>
}