// modules/cep/data/repositories/AddressRepositoryImpl.ts

import type { AddressRepository } from '../../domain/repositories/AddressRepository'
import type { Address } from '../../domain/entities/Address'
import { ViaCepDatasource } from '../datasources/ViaCepDatasource'
import { AddressModel } from '../models/AddressModel'

export class AddressRepositoryImpl implements AddressRepository {
  private datasource: ViaCepDatasource

  constructor(datasource: ViaCepDatasource) {
    this.datasource = datasource
  }

  async getAddressByCep(cep: string): Promise<Address> {
    const data = await this.datasource.getCep(cep)

    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    return AddressModel.fromJson(data)
  }
}