'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notify } from '@/components/Notify'
import { excluirProduto, type FormActionState } from './actions'

type ExcluirProdutoButtonProps = {
  produtoId: number
  produtoNome: string
}

export default function ExcluirProdutoButton({
  produtoId,
  produtoNome,
}: ExcluirProdutoButtonProps) {
  const router = useRouter()
  const initialState: FormActionState = {
    success: false,
    error: '',
  }
  const [state, formAction, pending] = useActionState<FormActionState, FormData>(
    excluirProduto,
    initialState,
  )

  useEffect(() => {
    if (state.success) {
      notify('Produto excluido com sucesso.')
      router.refresh()
      return
    }

    if (state.error) {
      notify(state.error, 'danger')
    }
  }, [router, state.error, state.success])

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Excluir o produto "${produtoNome}"?`,
        )

        if (!confirmed) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={produtoId} />
      <button
        type="submit"
        className="btn btn-sm btn-outline-danger"
        disabled={pending}
      >
        {pending ? 'excluindo...' : 'Excluir'}
      </button>
    </form>
  )
}
