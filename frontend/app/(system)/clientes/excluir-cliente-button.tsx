'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notify } from '@/components/Notify'
import { excluirCliente, type FormActionState } from './actions'

type ExcluirClienteButtonProps = {
  clienteId: number
  clienteNome: string
}

export default function ExcluirClienteButton({
  clienteId,
  clienteNome,
}: ExcluirClienteButtonProps) {
  const router = useRouter()
  const initialState: FormActionState = {
    success: false,
    error: '',
  }
  const [state, formAction, pending] = useActionState<FormActionState, FormData>(
    excluirCliente,
    initialState,
  )

  useEffect(() => {
    if (state.success) {
      notify('Cliente excluído com sucesso.')
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
          `Excluir o cliente "${clienteNome}"?`,
        )

        if (!confirmed) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={clienteId} />
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
