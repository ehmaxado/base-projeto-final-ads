'use server'

import { revalidatePath } from 'next/cache'
import { apiServerFetch } from '@/lib/api-server'

export type UsuarioAtual = {
  id: number
  nomeCompleto: string
  email: string
  perfil: string
  ativo: boolean
}

export async function atualizarUsuario(formData: FormData) {
  const nomeCompleto = String(formData.get('nomeCompleto') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()

  if (!nomeCompleto) {
    throw new Error('Nome completo é obrigatório')
  }

  const response = await apiServerFetch('/usuarios/atual', {
    method: 'PATCH',
    body: JSON.stringify({ nomeCompleto, email }),
  })

  if (!response.ok) {
    throw new Error('Erro ao atualizar usuário')
  }

  revalidatePath('/usuario')
}

export async function atualizarSenha(formData: FormData) {
  const senhaAtual = String(formData.get('senhaAtual') ?? '')
  const novaSenha = String(formData.get('novaSenha') ?? '')
  const confirmarSenha = String(formData.get('confirmarSenha') ?? '')

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    throw new Error('Preencha todos os campos de senha')
  }

  if (novaSenha !== confirmarSenha) {
    throw new Error('As senhas não conferem')
  }

  const response = await apiServerFetch('/usuarios/atual/senha', {
    method: 'PATCH',
    body: JSON.stringify({ senhaAtual, novaSenha }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message || 'Erro ao atualizar senha'
    throw new Error(message)
  }

  revalidatePath('/usuario')
}
