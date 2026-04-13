<!-- modules/cep/presentation/pages/CepPage.vue -->

<script setup lang="ts">
import { ref } from 'vue'

import { useCepBloc } from '../blocs/useCepBloc'

import { GetAddressByCep } from '../../domain/usecases/GetAddressByCep'
import { AddressRepositoryImpl } from '../../data/repositories/AddressRepositoryImpl'
import { ViaCepDatasource } from '../../data/datasources/ViaCepDatasource'

const cepInput = ref<string>('')

const datasource = new ViaCepDatasource()
const repository = new AddressRepositoryImpl(datasource)
const usecase = new GetAddressByCep(repository)

const { address, loading, error, searchCep } = useCepBloc(usecase)

const handleSearch = () => {
  const cep = cepInput.value.replace(/\D/g, '')
  searchCep(cep)
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Consulta de CEP</h1>

      <div class="input-group">
        <input
          v-model="cepInput"
          type="text"
          placeholder="Digite o CEP"
        />

        <button @click="handleSearch" :disabled="loading">
          <span v-if="!loading">Buscar</span>
          <span v-else class="loader"></span>
        </button>
      </div>

      <transition name="fade">
        <p v-if="error" class="error">
          {{ error }}
        </p>
      </transition>

      <transition name="slide">
        <div v-if="address" class="result">
          <div class="row">
            <span>CEP</span>
            <strong>{{ address.cep }}</strong>
          </div>

          <div class="row">
            <span>Logradouro</span>
            <strong>{{ address.logradouro }}</strong>
          </div>

          <div class="row">
            <span>Bairro</span>
            <strong>{{ address.bairro }}</strong>
          </div>

          <div class="row">
            <span>Cidade</span>
            <strong>{{ address.localidade }} - {{ address.uf }}</strong>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #1e1e2f, #0f0f1a);
  font-family: 'Inter', sans-serif;
}

.card {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  border-radius: 16px;

  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.1);

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);

  animation: fadeIn 0.6s ease;
}

h1 {
  color: #fff;
  margin-bottom: 20px;
  font-weight: 500;
}

.input-group {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;

  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  transition: 0.2s;
}

input::placeholder {
  color: #aaa;
}

input:focus {
  background: rgba(255, 255, 255, 0.12);
}

button {
  padding: 12px 16px;
  border-radius: 10px;
  border: none;

  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;

  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

.error {
  margin-top: 14px;
  color: #f87171;
  font-size: 13px;
}

.result {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #ddd;
}

.row strong {
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>