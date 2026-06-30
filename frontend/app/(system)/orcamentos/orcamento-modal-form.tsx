'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import { salvarOrcamento } from './actions'
import type { Cliente, FormActionState, Produto } from './actions'

type OrcamentoItem = {
  id?: number
  produtoId: number
  quantidade: number
  precoUnitarioRegistro: number
  nomeProdutoRegistro?: string
}

export type OrcamentoModalData = {
  id: number
  clienteId: number
  situacao: string
  valorDesconto: number
  validoAte: string | null
  observacoes: string | null
  itens: OrcamentoItem[]
}

type OrcamentoModalFormProps = {
  clientes: Cliente[]
  produtos: Produto[]
  orcamento?: OrcamentoModalData
}

type ItemFormState = {
  key: string
  produtoId: string
  quantidade: string
  precoUnitario: string
  productLabel?: string
}

function buildItemKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createEmptyItem(): ItemFormState {
  return {
    key: buildItemKey(),
    produtoId: '',
    quantidade: '1',
    precoUnitario: '',
    productLabel: '',
  }
}

function mapItems(itens?: OrcamentoItem[]): ItemFormState[] {
  if (!itens || itens.length === 0) {
    return [createEmptyItem()]
  }

  return itens.map((item) => ({
    key: buildItemKey(),
    produtoId: String(item.produtoId),
    quantidade: String(item.quantidade),
    precoUnitario: String(item.precoUnitarioRegistro),
    productLabel: item.nomeProdutoRegistro,
  }))
}

function formatDateInput(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

function formatOrcamentoNumero(id: number) {
  return String(id).padStart(4, '0')
}

export default function OrcamentoModalForm({
  clientes,
  produtos,
  orcamento,
}: OrcamentoModalFormProps) {
  const editing = Boolean(orcamento)
  const [items, setItems] = useState<ItemFormState[]>(() => mapItems(orcamento?.itens))
  const [itensDirty, setItensDirty] = useState(!editing)

  function addItem() {
    setItems((current) => [...current, createEmptyItem()])
    setItensDirty(true)
  }

  function updateItem(
    key: string,
    updater: (item: ItemFormState) => ItemFormState,
  ) {
    setItems((current) =>
      current.map((item) => (item.key === key ? updater(item) : item)),
    )
    setItensDirty(true)
  }

  function removeItem(key: string) {
    setItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.key !== key),
    )
    setItensDirty(true)
  }

  return (
    <Modal
      title={
        editing && orcamento
          ? `Editar orçamento ${formatOrcamentoNumero(orcamento.id)}`
          : 'Novo orçamento'
      }
      description="Cadastre os dados principais do orçamento e seus itens."
      triggerLabel={editing ? 'Editar' : 'Novo orçamento'}
      triggerClassName={
        editing ? 'btn btn-sm btn-outline-primary' : 'btn btn-primary'
      }
      size="lg"
      onOpenChange={(open) => {
        if (open) {
          setItems(mapItems(orcamento?.itens))
          setItensDirty(!editing)
        }
      }}
    >
      {({ close }) => (
        <OrcamentoModalContent
          clientes={clientes}
          produtos={produtos}
          orcamento={orcamento}
          items={items}
          itensDirty={itensDirty}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
          close={close}
        />
      )}
    </Modal>
  )
}

type OrcamentoModalContentProps = {
  clientes: Cliente[]
  produtos: Produto[]
  orcamento?: OrcamentoModalData
  items: ItemFormState[]
  itensDirty: boolean
  addItem: () => void
  updateItem: (key: string, updater: (item: ItemFormState) => ItemFormState) => void
  removeItem: (key: string) => void
  close: () => void
}

function OrcamentoModalContent({
  clientes,
  produtos,
  orcamento,
  items,
  itensDirty,
  addItem,
  updateItem,
  removeItem,
  close,
}: OrcamentoModalContentProps) {
  const router = useRouter()
  const initialFormActionState: FormActionState = {
    success: false,
    error: '',
  }
  const [state, formAction] = useActionState<FormActionState, FormData>(
    salvarOrcamento,
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
      <input type="hidden" name="id" value={orcamento?.id ?? ''} />
      <input type="hidden" name="itensDirty" value={itensDirty ? 'true' : ''} />

      {state.error ? (
        <div className="alert alert-danger mb-0" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="page-grid page-grid--two-columns">
        <div>
          <label htmlFor={`orcamento-cliente-${orcamento?.id ?? 'novo'}`} className="form-label">
            Cliente
          </label>
          <select
            id={`orcamento-cliente-${orcamento?.id ?? 'novo'}`}
            name="clienteId"
            className="form-select"
            defaultValue={String(orcamento?.clienteId ?? '')}
            required
          >
            <option value="" disabled>
              escolha um cliente
            </option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`orcamento-situacao-${orcamento?.id ?? 'novo'}`} className="form-label">
            Situação
          </label>
          <select
            id={`orcamento-situacao-${orcamento?.id ?? 'novo'}`}
            name="situacao"
            className="form-select"
            defaultValue={orcamento?.situacao ?? 'pendente'}
            required
          >
            <option value="pendente">pendente</option>
            <option value="enviado">enviado</option>
            <option value="aprovado">aprovado</option>
            <option value="rejeitado">rejeitado</option>
            <option value="cancelado">cancelado</option>
          </select>
        </div>

        <div>
          <label htmlFor={`orcamento-desconto-${orcamento?.id ?? 'novo'}`} className="form-label">
            Desconto
          </label>
          <input
            id={`orcamento-desconto-${orcamento?.id ?? 'novo'}`}
            name="valorDesconto"
            type="number"
            step="0.01"
            className="form-control"
            defaultValue={orcamento?.valorDesconto ?? 0}
          />
        </div>

        <div>
          <label htmlFor={`orcamento-validade-${orcamento?.id ?? 'novo'}`} className="form-label">
            Válido até
          </label>
          <input
            id={`orcamento-validade-${orcamento?.id ?? 'novo'}`}
            name="validoAte"
            type="date"
            className="form-control"
            defaultValue={formatDateInput(orcamento?.validoAte)}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`orcamento-observacoes-${orcamento?.id ?? 'novo'}`} className="form-label">
          Observações
        </label>
        <textarea
          id={`orcamento-observacoes-${orcamento?.id ?? 'novo'}`}
          name="observacoes"
          className="form-control"
          rows={3}
          defaultValue={orcamento?.observacoes ?? ''}
        />
      </div>

      <div className="items-placeholder">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="items-placeholder-title">Itens do orçamento</h4>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={addItem}>
            adicionar item
          </button>
        </div>

        <div className="app-modal__items">
          {items.map((item, index) => (
            <div key={item.key} className="app-modal__item-row">
              <div>
                <label className="form-label">Produto</label>
                <select
                  name="produtoId"
                  className="form-select"
                  value={item.produtoId}
                  onChange={(event) => {
                    const produtoSelecionado =
                      produtos.find(
                        (produto) => String(produto.id) === event.target.value,
                      ) ?? null

                    updateItem(item.key, (current) => ({
                      ...current,
                      produtoId: event.target.value,
                      precoUnitario: produtoSelecionado
                        ? String(produtoSelecionado.precoUnitario)
                        : current.precoUnitario,
                      productLabel: produtoSelecionado?.nome ?? current.productLabel,
                    }))
                  }}
                  required
                >
                  <option value="" disabled>
                    escolha um produto
                  </option>
                  {item.produtoId &&
                  item.productLabel &&
                  !produtos.some(
                    (produto) => String(produto.id) === item.produtoId,
                  ) ? (
                    <option value={item.produtoId}>
                      {item.productLabel}
                    </option>
                  ) : null}
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Quantidade</label>
                <input
                  name="quantidade"
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  value={item.quantidade}
                  onChange={(event) =>
                    updateItem(item.key, (current) => ({
                      ...current,
                      quantidade: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="form-label">Preço unitário</label>
                <input
                  name="precoUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={item.precoUnitario}
                  onChange={(event) =>
                    updateItem(item.key, (current) => ({
                      ...current,
                      precoUnitario: event.target.value,
                    }))
                  }
                  placeholder="usar preço do produto"
                />
              </div>

              <div className="app-modal__item-actions">
                <label className="form-label d-block">
                  {index === 0 ? 'Ações' : ' '}
                </label>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeItem(item.key)}
                  disabled={items.length === 1}
                >
                  remover
                </button>
              </div>
            </div>
          ))}
        </div>
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
