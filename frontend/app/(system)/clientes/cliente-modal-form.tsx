'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import { salvarCliente } from './actions'
import type { Cliente, FormActionState } from './actions'

type ClienteModalFormProps = {
  cliente?: Cliente
}

export default function ClienteModalForm({ cliente }: ClienteModalFormProps) {
  const editing = Boolean(cliente)

  return (
    <Modal
      title={editing ? 'Editar cliente' : 'Novo cliente'}
      description="Preencha os dados principais do cliente."
      triggerLabel={editing ? 'Editar' : 'Novo cliente'}
      triggerClassName={
        editing ? 'btn btn-sm btn-outline-primary' : 'btn btn-primary'
      }
    >
      {({ close }) => (
        <ClienteModalContent cliente={cliente} close={close} />
      )}
    </Modal>
  )
}

type ClienteModalContentProps = {
  cliente?: Cliente
  close: () => void
}

function ClienteModalContent({ cliente, close }: ClienteModalContentProps) {
  const router = useRouter()
  const initialFormActionState: FormActionState = {
    success: false,
    error: '',
  }
  const [state, formAction] = useActionState<FormActionState, FormData>(
    salvarCliente,
    initialFormActionState,
  )

  useEffect(() => {
    if (state.success) {
      close()
      router.refresh()
    }
  }, [close, router, state.success])

  return (
    <form action={formAction} className="form-stack">
      <input type="hidden" name="id" value={cliente?.id ?? ''} />

      {state.error ? (
        <div className="alert alert-danger mb-0" role="alert">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor={`cliente-nome-${cliente?.id ?? 'novo'}`} className="form-label">
          Nome ou razão social
        </label>
        <input
          id={`cliente-nome-${cliente?.id ?? 'novo'}`}
          name="nome"
          className="form-control"
          defaultValue={cliente?.nome ?? ''}
          required
        />
      </div>

      <div>
        <label htmlFor={`cliente-documento-${cliente?.id ?? 'novo'}`} className="form-label">
          Documento
        </label>
        <input
          id={`cliente-documento-${cliente?.id ?? 'novo'}`}
          name="documento"
          className="form-control"
          defaultValue={cliente?.documento ?? ''}
        />
      </div>

      <div>
        <label htmlFor={`cliente-email-${cliente?.id ?? 'novo'}`} className="form-label">
          Email
        </label>
        <input
          id={`cliente-email-${cliente?.id ?? 'novo'}`}
          name="email"
          type="email"
          className="form-control"
          defaultValue={cliente?.email ?? ''}
        />
      </div>

      <div>
        <label htmlFor={`cliente-telefone-${cliente?.id ?? 'novo'}`} className="form-label">
          Telefone
        </label>
        <input
          id={`cliente-telefone-${cliente?.id ?? 'novo'}`}
          name="telefone"
          className="form-control"
          defaultValue={cliente?.telefone ?? ''}
        />
      </div>

      <div>
        <label htmlFor={`cliente-observacoes-${cliente?.id ?? 'novo'}`} className="form-label">
          Observações
        </label>
        <textarea
          id={`cliente-observacoes-${cliente?.id ?? 'novo'}`}
          name="observacoes"
          className="form-control"
          rows={4}
          defaultValue={cliente?.observacoes ?? ''}
        />
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={close}>
          cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          salvar
        </button>
      </div>
    </form>
  )
}
