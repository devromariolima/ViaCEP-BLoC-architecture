<!-- modules/cep/presentation/pages/CepPage.vue -->

<script setup lang="ts">
import { ref } from 'vue'

// BLoC
import { useCepBloc } from '../blocs/useCepBloc'

// injeção manual
import { GetAddressByCep } from '../../domain/usecases/GetAddressByCep'
import { AddressRepositoryImpl } from '../../data/repositories/AddressRepositoryImpl'
import { ViaCepDatasource } from '../../data/datasources/ViaCepDatasource'

const cepInput = ref<string>('')

const datasource = new ViaCepDatasource()
const repository = new AddressRepositoryImpl(datasource)
const usecase = new GetAddressByCep(repository)

const { address, loading, error, searchCep } = useCepBloc(usecase)
</script>

<template>
  <div>
    <input v-model="cepInput" placeholder="Digite o CEP" />
    <button @click="searchCep(cepInput)">Buscar</button>

    <p v-if="loading">Carregando...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="address">
      <p>{{ address.logradouro }}</p>
      <p>{{ address.bairro }}</p>
      <p>{{ address.localidade }} - {{ address.uf }}</p>
    </div>
  </div>
</template>