'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Cliente = {
  clienteId: number
  nome: string
  totalOrcamentos: number
}

type Props = {
  dados: Cliente[]
}

export default function GraficoTopClientes({ dados }: Props) {
  if (dados.length === 0) {
    return <p className="text-muted mb-0">Sem dados de clientes.</p>
  }

  const dadosFormatados = dados.map((item) => ({
    nome: item.nome,
    total: item.totalOrcamentos,
  }))

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={dadosFormatados}
          layout="vertical"
          margin={{
            top: 10,
            right: 30,
            left: 80,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" allowDecimals={false} />

          <YAxis
            type="category"
            dataKey="nome"
            width={120}
          />

          <Tooltip />

          <Bar
            dataKey="total"
            name="Orçamentos"
            fill="#3b82f6"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}