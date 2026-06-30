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

export type FormActionState = {
  success: boolean
  error: string
}

async function getResponseError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as {
      mensagem?: string
      detalhes?: string[]
    }

    if (Array.isArray(data.detalhes) && data.detalhes.length > 0) {
      return data.detalhes.join(', ')
    }

    if (data.mensagem) {
      return data.mensagem
    }
  } catch {}

  return fallback
}

export async function salvarProduto(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get('id') ?? '').trim()
  const nome = String(formData.get('nome') ?? '').trim()
  const codigoSku = String(formData.get('codigoSku') ?? '').trim() || null
  const descricao = String(formData.get('descricao') ?? '').trim() || null
  const precoUnitario = Number(formData.get('precoUnitario') ?? 0)
  const unidade = String(formData.get('unidade') ?? 'UN').trim() || 'UN'
  const ativo = formData.get('ativo') === 'on'

  if (!nome) {
    return {
      success: false,
      error: 'Nome é obrigatório',
    }
  }

  if (!(precoUnitario > 0)) {
    return {
      success: false,
      error: 'Informe um preço unitário maior que zero',
    }
  }

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
    return {
      success: false,
      error: await getResponseError(response, 'Erro ao salvar produto'),
    }
  }

  revalidatePath('/produtos')

  return {
    success: true,
    error: '',
  }
}

export async function excluirProduto(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    return {
      success: false,
      error: 'ID do produto é obrigatório',
    }
  }

  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    return {
      success: false,
      error: await getResponseError(response, 'Erro ao excluir produto'),
    }
  }

  revalidatePath('/produtos')

  return {
    success: true,
    error: '',
  }
}
