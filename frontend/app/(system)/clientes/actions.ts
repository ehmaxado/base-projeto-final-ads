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

export async function salvarCliente(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  const nome = String(formData.get('nome') ?? '').trim()
  const documento = String(formData.get('documento') ?? '').trim() || null
  const email = String(formData.get('email') ?? '').trim() || null
  const telefone = String(formData.get('telefone') ?? '').trim() || null
  const observacoes = String(formData.get('observacoes') ?? '').trim() || null

  if (!nome) {
    throw new Error('Nome é obrigatório')
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
    throw new Error('Erro ao salvar cliente')
  }

  revalidatePath('/clientes')
}

export async function excluirCliente(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()

  if (!id) {
    throw new Error('ID do cliente é obrigatório')
  }

  const response = await apiServerFetch(`/clientes/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Erro ao excluir cliente')
  }

  revalidatePath('/clientes')
}
