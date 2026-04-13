// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'

import CepPage from '../modules/cep/presentation/pages/CepPage.vue'

const routes = [
  {
    path: '/',
    name: 'cep',
    component: CepPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})