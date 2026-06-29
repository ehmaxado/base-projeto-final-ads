'use server'

import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'

export type Produto = {
  id: number
  codigoSku: string | null
  nome: string
  descricao: string | null
  precoUnitario: number
  unidade: string
  ativo: boolean
}

export async function salvarProduto(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  const nome = String(formData.get('nome') ?? '').trim()
  const codigoSku = String(formData.get('codigoSku') ?? '').trim() || null
  const descricao = String(formData.get('descricao') ?? '').trim() || null
  const precoUnitario = Number(formData.get('precoUnitario') ?? 0)
  const unidade = String(formData.get('unidade') ?? 'UN').trim() || 'UN'
  const ativo = formData.get('ativo') === 'on'

  const payload = {
    nome,
    codigoSku,
    descricao,
    precoUnitario,
    unidade,
    ativo,
  }

  const endpoint = id ? `/produtos/${id}` : '/produtos'
  const method = id ? 'PATCH' : 'POST'

  const response = await apiServerFetch(endpoint, {
    method,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar produto')
  }

  revalidatePath('/produtos')
}

export async function excluirProduto(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    throw new Error('ID do produto é obrigatório')
  }

  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Erro ao excluir produto')
  }

  revalidatePath('/produtos')
}
