type Fatia = {
  situacao: string
  total: number
}

const CORES: Record<string, string> = {
  pendente: '#f59e0b',
  enviado: '#3b82f6',
  aprovado: '#22c55e',
  rejeitado: '#ef4444',
  cancelado: '#6b7280',
}

const COR_PADRAO = '#94a3b8'

function polarParaXY(cx: number, cy: number, r: number, angulo: number) {
  const rad = ((angulo - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function caminhoFatia(cx: number, cy: number, r: number, inicio: number, fim: number): string {
  const fimAjustado = Math.min(fim, inicio + 359.9999)
  const p1 = polarParaXY(cx, cy, r, inicio)
  const p2 = polarParaXY(cx, cy, r, fimAjustado)
  const arcoGrande = fimAjustado - inicio > 180 ? 1 : 0
  return [
    `M ${cx} ${cy}`,
    `L ${p1.x.toFixed(4)} ${p1.y.toFixed(4)}`,
    `A ${r} ${r} 0 ${arcoGrande} 1 ${p2.x.toFixed(4)} ${p2.y.toFixed(4)}`,
    'Z',
  ].join(' ')
}

type Props = {
  dados: Fatia[]
}

export default function GraficoPizzaStatus({ dados }: Props) {
  const total = dados.reduce((soma, d) => soma + d.total, 0)

  if (total === 0) {
    return <p className="text-muted mb-0">Nenhum orçamento registrado.</p>
  }

  const cx = 100
  const cy = 100
  const r = 90

  let anguloAtual = 0
  const fatias = dados.map((d) => {
    const angulo = (d.total / total) * 360
    const inicio = anguloAtual
    const fim = anguloAtual + angulo
    anguloAtual = fim
    return { ...d, inicio, fim }
  })

  const unicaFatia = fatias.length === 1

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <svg viewBox="0 0 200 200" width={200} height={200} aria-label="Gráfico de pizza: status dos orçamentos">
        {unicaFatia ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={CORES[fatias[0].situacao] ?? COR_PADRAO}
          />
        ) : (
          fatias.map((f) => (
            <path
              key={f.situacao}
              d={caminhoFatia(cx, cy, r, f.inicio, f.fim)}
              fill={CORES[f.situacao] ?? COR_PADRAO}
            />
          ))
        )}
      </svg>

      <ul className="list-unstyled d-flex flex-wrap gap-3 justify-content-center mb-0">
        {fatias.map((f) => (
          <li key={f.situacao} className="d-flex align-items-center gap-1 small">
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 2,
                background: CORES[f.situacao] ?? COR_PADRAO,
                flexShrink: 0,
              }}
            />
            {f.situacao}: <strong>{f.total}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
