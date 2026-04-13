# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 🧠 Arquitetura da Aplicação (Vue.js + BLoC + Clean Architecture)

Este projeto foi estruturado utilizando uma adaptação da **Clean Architecture** combinada com o padrão **BLoC (Business Logic Component)**, aplicado ao ecossistema do Vue.js através da Composition API.

O objetivo desta arquitetura é:

* Separar responsabilidades
* Facilitar manutenção e escalabilidade
* Permitir testes isolados
* Tornar o código previsível e organizado

---

# 🏗️ Visão Geral da Arquitetura

A aplicação é dividida em **módulos (feature-first)**, e dentro de cada módulo temos três camadas principais:

```
modules/
 └── cep/
      ├── data/
      ├── domain/
      └── presentation/
```

Cada camada possui uma responsabilidade bem definida.

---

# 🔵 DOMAIN (Regra de Negócio)

A camada **domain** é o coração da aplicação.

Ela contém:

* Entidades (models puros)
* Contratos (interfaces)
* Casos de uso (usecases)

🚫 Não depende de Vue, API ou qualquer tecnologia externa.

---

## 📄 entities/Address.ts

Define a estrutura de um endereço.

```ts
export interface Address {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
}
```

👉 Representa um objeto puro de negócio.

---

## 📄 repositories/AddressRepository.ts

Define o contrato que a camada de dados deve implementar.

```ts
export interface AddressRepository {
  getAddressByCep(cep: string): Promise<Address>
}
```

👉 O domínio não sabe **como** os dados vêm, apenas **que precisa deles**.

---

## 📄 usecases/GetAddressByCep.ts

Responsável pela lógica de negócio.

```ts
export class GetAddressByCep {
  private repository: AddressRepository

  constructor(repository: AddressRepository) {
    this.repository = repository
  }

  async execute(cep: string): Promise<Address> {
    if (!cep || cep.length !== 8) {
      throw new Error('CEP inválido')
    }

    return this.repository.getAddressByCep(cep)
  }
}
```

### Responsabilidades:

* Validar dados
* Orquestrar chamadas
* Aplicar regras de negócio

---

# 🟢 DATA (Fonte de Dados)

A camada **data** implementa os contratos definidos no domain.

Ela contém:

* Datasources (API)
* DTOs (tipagem externa)
* Models (mapeamento)
* Repositories (implementação)

---

## 📄 dtos/ViaCepResponse.ts

Define o formato da resposta da API externa.

```ts
export interface ViaCepResponse {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
```

---

## 📄 datasources/ViaCepDatasource.ts

Responsável por acessar a API.

```ts
export class ViaCepDatasource {
  async getCep(cep: string): Promise<ViaCepResponse> {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    return response.json()
  }
}
```

👉 Comunicação direta com API externa.

---

## 📄 models/AddressModel.ts

Converte o DTO para a entidade do domínio.

```ts
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
```

👉 Aqui ocorre o desacoplamento entre API e domínio.

---

## 📄 repositories/AddressRepositoryImpl.ts

Implementa o contrato do domínio.

```ts
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
```

### Responsabilidades:

* Consumir datasource
* Tratar erros da API
* Retornar dados no formato do domínio

---

# 🟡 PRESENTATION (UI + BLoC)

A camada **presentation** é responsável pela interface e estado da UI.

Ela contém:

* Pages (telas)
* Composables (BLoC)
* Components

---

## 📄 blocs/useCepBloc.ts

Implementação do padrão BLoC usando Composition API.

```ts
export function useCepBloc(getAddressByCep: GetAddressByCep) {
  const address = ref<Address | null>(null)
  const loading = ref(false)
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
```

### Aqui temos o BLoC:

| Conceito BLoC | Implementação        |
| ------------- | -------------------- |
| State         | `ref()`              |
| Event         | `searchCep`          |
| Logic         | dentro do composable |

---

## 📄 pages/CepPage.vue

Camada visual (UI).

```vue
<script setup lang="ts">
const { address, loading, error, searchCep } = useCepBloc(usecase)
</script>
```

### Responsabilidades:

* Renderizar UI
* Capturar input do usuário
* Chamar eventos do BLoC

👉 NÃO contém regra de negócio.

---

# 🔄 Fluxo Completo da Aplicação

```text
Usuário digita CEP
        ↓
CepPage.vue (UI)
        ↓
useCepBloc (BLoC)
        ↓
GetAddressByCep (UseCase)
        ↓
AddressRepository (interface)
        ↓
AddressRepositoryImpl (data)
        ↓
ViaCepDatasource (API)
        ↓
ViaCEP (externo)
```

---

# 🧠 Benefícios da Arquitetura

### ✅ Separação de responsabilidades

Cada camada tem uma função clara.

### ✅ Testabilidade

UseCases podem ser testados sem Vue ou API.

### ✅ Escalabilidade

Fácil adicionar novos módulos (user, auth, etc.)

### ✅ Manutenção

Código previsível e organizado.

---

# ⚠️ Observações Importantes

* Evitar lógica de negócio na camada de apresentação
* Não acessar datasources diretamente na UI
* Sempre passar pelo UseCase
* Preferir interfaces para desacoplamento

---

# 🚀 Conclusão

Esta arquitetura combina:

* Clean Architecture (estrutura)
* BLoC (gestão de estado e lógica)
* Vue Composition API (implementação)

O resultado é um código:

* Organizado
* Escalável
* Profissional
* Preparado para projetos reais
