// modules/cep/data/datasources/ViaCepDatasource.ts

import { Api } from '@/core/http/api'
import type { ViaCepResponse } from '../dtos/ViaCepResponse'

export class ViaCepDatasource {
  private api: Api

  constructor() {
    this.api = new Api('https://viacep.com.br/ws')
  }

  async getCep(cep: string): Promise<ViaCepResponse> {
    return this.api.get<ViaCepResponse>(`/${cep}/json/`)
  }
}