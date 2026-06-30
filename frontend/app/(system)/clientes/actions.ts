'use server'

import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'

export type Cliente = {
  id: number
  nome: string
  documento: string | null
  email: string | null
  telefone: string | null
  observacoes: string | null
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

export async function salvarCliente(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get('id') ?? '').trim()
  const nome = String(formData.get('nome') ?? '').trim()
  const documento = String(formData.get('documento') ?? '').trim() || null
  const email = String(formData.get('email') ?? '').trim() || null
  const telefone = String(formData.get('telefone') ?? '').trim() || null
  const observacoes = String(formData.get('observacoes') ?? '').trim() || null

  if (!nome) {
    return {
      success: false,
      error: 'Nome é obrigatório',
    }
  }

  const payload = {
    nome,
    documento,
    email,
    telefone,
    observacoes,
  }

  const endpoint = id ? `/clientes/${id}` : '/clientes'
  const method = id ? 'PATCH' : 'POST'

  const response = await apiServerFetch(endpoint, {
    method,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    return {
      success: false,
      error: await getResponseError(response, 'Erro ao salvar cliente'),
    }
  }

  revalidatePath('/clientes')

  return {
    success: true,
    error: '',
  }
}

export async function excluirCliente(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    return {
      success: false,
      error: 'ID do cliente é obrigatório',
    }
  }

  const response = await apiServerFetch(`/clientes/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    return {
      success: false,
      error: await getResponseError(response, 'Erro ao excluir cliente'),
    }
  }

  revalidatePath('/clientes')

  return {
    success: true,
    error: '',
  }
}
