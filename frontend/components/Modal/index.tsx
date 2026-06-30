'use client'

import { ReactNode, useId, useRef, useState } from 'react'

type ModalRenderProps = {
  close: () => void
}

type ModalProps = {
  title: string
  description?: string
  triggerLabel: string
  triggerClassName?: string
  size?: 'md' | 'lg'
  onOpenChange?: (open: boolean) => void
  children: ReactNode | ((props: ModalRenderProps) => ReactNode)
}

export default function Modal({
  title,
  description,
  triggerLabel,
  triggerClassName = 'btn btn-primary',
  size = 'md',
  onOpenChange,
  children,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [instanceKey, setInstanceKey] = useState(0)

  function open() {
    setInstanceKey((current) => current + 1)
    dialogRef.current?.showModal()
    onOpenChange?.(true)
  }

  function close() {
    dialogRef.current?.close()
    onOpenChange?.(false)
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      close()
    }
  }

  const content =
    typeof children === 'function' ? children({ close }) : children

  return (
    <>
      <button type="button" className={triggerClassName} onClick={open}>
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        className="app-modal"
        aria-labelledby={titleId}
        onClick={handleBackdropClick}
      >
        <div className={`app-modal__surface app-modal__surface--${size}`}>
          <div className="app-modal__header">
            <div>
              <h3 id={titleId} className="app-modal__title">
                {title}
              </h3>
              {description ? (
                <p className="app-modal__description mb-0">{description}</p>
              ) : null}
            </div>

            <button
              type="button"
              className="app-modal__close"
              aria-label="Fechar modal"
              onClick={close}
            >
              x
            </button>
          </div>

          <div key={instanceKey} className="app-modal__body">
            {content}
          </div>
        </div>
      </dialog>
    </>
  )
}
