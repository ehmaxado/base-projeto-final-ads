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
  itens?: OrcamentoItemPayload[]
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

export async function salvarOrcamento(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const id = String(formData.get('id') ?? '').trim()
  const itensDirty = formData.get('itensDirty') === 'true'
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
    return {
      success: false,
      error: 'Selecione um cliente para o orçamento',
    }
  }

  if (!id && itens.length === 0) {
    return {
      success: false,
      error: 'Adicione pelo menos um item ao orçamento',
    }
  }

  if (id && itensDirty && itens.length === 0) {
    return {
      success: false,
      error: 'Adicione pelo menos um item válido ou desfaça as alterações nas linhas.',
    }
  }

  const payload: OrcamentoPayload = {
    clienteId,
    valorDesconto,
    validoAte,
    observacoes,
    situacao,
    ...(!id || itensDirty ? { itens } : {}),
  }

  const endpoint = id ? `/orcamentos/${id}` : '/orcamentos'
  const method = id ? 'PATCH' : 'POST'

  const response = await apiServerFetch(endpoint, {
    method,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    return {
      success: false,
      error: await getResponseError(response, 'Erro ao salvar orçamento'),
    }
  }

  revalidatePath('/orcamentos')

  return {
    success: true,
    error: '',
  }
}
