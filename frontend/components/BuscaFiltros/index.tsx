import { Suspense } from 'react'
import BuscaFiltrosInner from './inner'
import type { Campo } from './inner'

export type { Campo }

type Props = {
  campos: Campo[]
}

export default function BuscaFiltros({ campos }: Props) {
  return (
    <Suspense>
      <BuscaFiltrosInner campos={campos} />
    </Suspense>
  )
}
