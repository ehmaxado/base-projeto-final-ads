import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Cliente, Produto } from './actions'
import OrcamentoModalForm, { OrcamentoModalData } from './orcamento-modal-form'
import { formatMoney } from './utils'

type OrcamentoResumo = OrcamentoModalData & {
  cliente?: {
    nome: string
  }
  total: number
}

function formatOrcamentoNumero(id: number) {
  return String(id).padStart(4, '0')
}

export default async function OrcamentosPage() {
  const [clientes, produtos] = await Promise.all([getClientes(), getProdutos()])
  const orcamentos = await getOrcamentos()

  return (
    <div className="page-content">
      <PageIntro
        title="Orçamentos"
        description="Gerencie orçamentos, itens e status."
      />

      <div className="page-grid page-grid--full">
        <SectionCard title="Lista de orçamentos">
          <div className="d-flex justify-content-end mb-3">
            <OrcamentoModalForm clientes={clientes} produtos={produtos} />
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((orcamento) => (
                  <tr key={orcamento.id}>
                    <td>{formatOrcamentoNumero(orcamento.id)}</td>
                    <td>{orcamento.cliente?.nome ?? '-'}</td>
                    <td>{formatMoney(orcamento.total)}</td>
                    <td>{orcamento.situacao}</td>
                    <td>
                      <OrcamentoModalForm
                        clientes={clientes}
                        produtos={produtos}
                        orcamento={orcamento}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

async function getClientes() {
  const response = await apiServerFetch('/clientes', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as Cliente[]) : []
}

async function getProdutos() {
  const response = await apiServerFetch('/produtos?ativo=true', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as Produto[]) : []
}

async function getOrcamentos() {
  const response = await apiServerFetch('/orcamentos', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as OrcamentoResumo[]) : []
}
