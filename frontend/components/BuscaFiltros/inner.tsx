'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

export type CampoTexto = {
  type: 'text'
  name: string
  placeholder: string
}

export type CampoSelect = {
  type: 'select'
  name: string
  label: string
  options: { value: string; label: string }[]
}

export type Campo = CampoTexto | CampoSelect

type Props = {
  campos: Campo[]
}

export default function BuscaFiltrosInner({ campos }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  function aplicarFiltros(form: HTMLFormElement) {
    const params = new URLSearchParams()
    campos.forEach((campo) => {
      const el = form.elements.namedItem(campo.name) as HTMLInputElement | HTMLSelectElement | null
      if (el?.value) params.set(campo.name, el.value)
    })
    router.replace(`?${params.toString()}`)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    aplicarFiltros(event.currentTarget)
  }

  function handleSelectChange() {
    if (formRef.current) aplicarFiltros(formRef.current)
  }

  const temCampoTexto = campos.some((c) => c.type === 'text')

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="d-flex gap-2 align-items-end flex-wrap"
    >
      {campos.map((campo) => {
        if (campo.type === 'text') {
          return (
            <input
              key={campo.name}
              name={campo.name}
              type="search"
              className="form-control"
              placeholder={campo.placeholder}
              defaultValue={searchParams.get(campo.name) ?? ''}
              style={{ maxWidth: 240 }}
            />
          )
        }

        return (
          <select
            key={campo.name}
            name={campo.name}
            className="form-select"
            defaultValue={searchParams.get(campo.name) ?? ''}
            onChange={handleSelectChange}
            style={{ maxWidth: 200 }}
          >
            {campo.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      })}

      {temCampoTexto && (
        <button type="submit" className="btn btn-outline-secondary">
          Buscar
        </button>
      )}
    </form>
  )
}
