'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import { salvarProduto } from './actions'
import type { FormActionState, Produto } from './actions'

type ProdutoModalFormProps = {
  produto?: Produto
}

export default function ProdutoModalForm({ produto }: ProdutoModalFormProps) {
  const editing = Boolean(produto)

  return (
    <Modal
      title={editing ? 'Editar produto' : 'Novo produto'}
      description="Preencha os dados principais do produto."
      triggerLabel={editing ? 'Editar' : 'Novo produto'}
      triggerClassName={
        editing ? 'btn btn-sm btn-outline-primary' : 'btn btn-primary'
      }
    >
      {({ close }) => (
        <ProdutoModalContent produto={produto} close={close} />
      )}
    </Modal>
  )
}

type ProdutoModalContentProps = {
  produto?: Produto
  close: () => void
}

function ProdutoModalContent({ produto, close }: ProdutoModalContentProps) {
  const router = useRouter()
  const initialFormActionState: FormActionState = {
    success: false,
    error: '',
  }
  const [state, formAction] = useActionState<FormActionState, FormData>(
    salvarProduto,
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
      <input type="hidden" name="id" value={produto?.id ?? ''} />

      {state.error ? (
        <div className="alert alert-danger mb-0" role="alert">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor={`produto-nome-${produto?.id ?? 'novo'}`} className="form-label">
          Nome
        </label>
        <input
          id={`produto-nome-${produto?.id ?? 'novo'}`}
          name="nome"
          className="form-control"
          defaultValue={produto?.nome ?? ''}
          required
        />
      </div>

      <div>
        <label htmlFor={`produto-codigo-${produto?.id ?? 'novo'}`} className="form-label">
          Código SKU
        </label>
        <input
          id={`produto-codigo-${produto?.id ?? 'novo'}`}
          name="codigoSku"
          className="form-control"
          defaultValue={produto?.codigoSku ?? ''}
        />
      </div>

      <div className="page-grid page-grid--two-columns">
        <div>
          <label htmlFor={`produto-preco-${produto?.id ?? 'novo'}`} className="form-label">
            Preço unitário
          </label>
          <input
            id={`produto-preco-${produto?.id ?? 'novo'}`}
            name="precoUnitario"
            type="number"
            step="0.01"
            className="form-control"
            defaultValue={produto?.precoUnitario ?? ''}
            required
          />
        </div>

        <div>
          <label htmlFor={`produto-unidade-${produto?.id ?? 'novo'}`} className="form-label">
            Unidade
          </label>
          <input
            id={`produto-unidade-${produto?.id ?? 'novo'}`}
            name="unidade"
            className="form-control"
            defaultValue={produto?.unidade ?? 'UN'}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor={`produto-descricao-${produto?.id ?? 'novo'}`} className="form-label">
          Descrição
        </label>
        <textarea
          id={`produto-descricao-${produto?.id ?? 'novo'}`}
          name="descricao"
          className="form-control"
          rows={4}
          defaultValue={produto?.descricao ?? ''}
        />
      </div>

      <div className="form-check">
        <input
          id={`produto-ativo-${produto?.id ?? 'novo'}`}
          name="ativo"
          type="checkbox"
          className="form-check-input"
          defaultChecked={produto?.ativo ?? true}
        />
        <label htmlFor={`produto-ativo-${produto?.id ?? 'novo'}`} className="form-check-label">
          Ativo
        </label>
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
