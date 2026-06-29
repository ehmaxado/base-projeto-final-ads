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

export type Produto = {
  id: number
  nome: string
  descricao: string | null
  codigoSku: string | null
  precoUnitario: number
  unidade: string
  ativo: boolean
}

export type OrcamentoItemPayload = {
  produtoId: number
  quantidade: number
  precoUnitario: number | undefined
}

export type OrcamentoPayload = {
  id?: number
  clienteId: number
  valorDesconto: number
  validoAte?: string
  observacoes?: string
  situacao: string
  itens: OrcamentoItemPayload[]
}

export async function salvarOrcamento(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  const clienteId = Number(formData.get('clienteId') ?? 0)
  const valorDesconto = Number(formData.get('valorDesconto') ?? 0)
  const validoAte = String(formData.get('validoAte') ?? '').trim() || undefined
  const observacoes = String(formData.get('observacoes') ?? '').trim() || undefined
  const situacao = String(formData.get('situacao') ?? 'pendente').trim()

  const produtoIds = formData.getAll('produtoId')
  const quantidades = formData.getAll('quantidade')
  const precos = formData.getAll('precoUnitario')

  const itens = produtoIds
    .map((produtoIdValue, index) => {
      const produtoId = Number(produtoIdValue)
      const quantidade = Number(quantidades[index] ?? 0)
      const precoUnitario = Number(precos[index] ?? 0)

      if (!produtoId || quantidade <= 0) {
        return null
      }

      return {
        produtoId,
        quantidade,
        precoUnitario: precoUnitario > 0 ? precoUnitario : undefined,
      }
    })
    .filter((item): item is OrcamentoItemPayload => item !== null)

  if (!clienteId) {
    throw new Error('Selecione um cliente para o orçamento')
  }

  if (itens.length === 0) {
    throw new Error('Adicione pelo menos um item ao orçamento')
  }

  const payload: OrcamentoPayload = {
    clienteId,
    valorDesconto,
    validoAte,
    observacoes,
    situacao,
    itens,
  }

  const endpoint = id ? `/orcamentos/${id}` : '/orcamentos'
  const method = id ? 'PATCH' : 'POST'

  const response = await apiServerFetch(endpoint, {
    method,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Erro ao salvar orçamento')
  }

  revalidatePath('/orcamentos')
}
