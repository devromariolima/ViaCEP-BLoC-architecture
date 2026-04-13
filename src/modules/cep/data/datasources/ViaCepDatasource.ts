// modules/cep/data/datasources/ViaCepDatasource.ts

import type { ViaCepResponse } from '../dtos/ViaCepResponse'

export class ViaCepDatasource {
  async getCep(cep: string): Promise<ViaCepResponse> {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    return response.json()
  }
}