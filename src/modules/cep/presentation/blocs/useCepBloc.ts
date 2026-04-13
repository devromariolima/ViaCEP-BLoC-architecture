// modules/cep/presentation/blocs/useCepBloc.ts

import { ref } from 'vue'
import type { Address } from '../../domain/entities/Address'
import { GetAddressByCep } from '../../domain/usecases/GetAddressByCep'

export function useCepBloc(getAddressByCep: GetAddressByCep) {
  const address = ref<Address | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const searchCep = async (cep: string) => {
    loading.value = true
    error.value = null
    address.value = null

    try {
      address.value = await getAddressByCep.execute(cep)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    address,
    loading,
    error,
    searchCep
  }
}