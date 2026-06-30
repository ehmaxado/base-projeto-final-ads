type ItemMes = {
  ano: number
  mes: number
  total: number
}

type Props = {
  dados: ItemMes[]
}

const COR_BARRA = '#3b82f6'
const COR_TEXTO = '#334155'
const COR_LINHA = '#cbd5e1'

function nomeMes(mes: number) {
  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  return meses[mes - 1] ?? String(mes)
}

export default function GraficoPalitosMes({ dados }: Props) {
  if (dados.length === 0) {
    return <p className="text-muted mb-0">Não há dados de quantidade por mês.</p>
  }

  const largura = 640
  const altura = 280

  const margemTopo = 20
  const margemDireita = 20
  const margemBaixo = 50
  const margemEsquerda = 45

  const larguraGrafico = largura - margemEsquerda - margemDireita
  const alturaGrafico = altura - margemTopo - margemBaixo

  const maiorValor = Math.max(...dados.map((d) => d.total), 1)

  const espacoPorBarra = larguraGrafico / dados.length
  const larguraBarra = Math.min(42, espacoPorBarra * 0.6)

  return (
    <div className="w-100">
      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        width="100%"
        height={altura}
        role="img"
        aria-label="Gráfico de barras: quantidade de orçamentos por mês"
      >
        {/* Linha vertical */}
        <line
          x1={margemEsquerda}
          y1={margemTopo}
          x2={margemEsquerda}
          y2={altura - margemBaixo}
          stroke={COR_LINHA}
        />

        {/* Linha horizontal */}
        <line
          x1={margemEsquerda}
          y1={altura - margemBaixo}
          x2={largura - margemDireita}
          y2={altura - margemBaixo}
          stroke={COR_LINHA}
        />

        {/* Valor máximo no eixo Y */}
        <text
          x={margemEsquerda - 8}
          y={margemTopo + 5}
          textAnchor="end"
          fontSize="12"
          fill={COR_TEXTO}
        >
          {maiorValor}
        </text>

        {/* Valor zero */}
        <text
          x={margemEsquerda - 8}
          y={altura - margemBaixo + 4}
          textAnchor="end"
          fontSize="12"
          fill={COR_TEXTO}
        >
          0
        </text>

        {dados.map((item, index) => {
          const alturaBarra = (item.total / maiorValor) * alturaGrafico

          const x =
            margemEsquerda +
            index * espacoPorBarra +
            espacoPorBarra / 2 -
            larguraBarra / 2

          const y = altura - margemBaixo - alturaBarra

          return (
            <g key={`${item.ano}-${item.mes}`}>
              <rect
                x={x}
                y={y}
                width={larguraBarra}
                height={alturaBarra}
                rx={4}
                fill={COR_BARRA}
              />

              <text
                x={x + larguraBarra / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="12"
                fill={COR_TEXTO}
              >
                {item.total}
              </text>

              <text
                x={x + larguraBarra / 2}
                y={altura - margemBaixo + 22}
                textAnchor="middle"
                fontSize="12"
                fill={COR_TEXTO}
              >
                {nomeMes(item.mes)}
              </text>

              <text
                x={x + larguraBarra / 2}
                y={altura - margemBaixo + 38}
                textAnchor="middle"
                fontSize="10"
                fill={COR_TEXTO}
              >
                {item.ano}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}