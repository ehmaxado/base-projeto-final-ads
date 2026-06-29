import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Cliente, Produto, salvarOrcamento } from './actions'
import { formatMoney } from './utils'

export default async function OrcamentosPage() {
  const [clientes, produtos] = await Promise.all([getClientes(), getProdutos()])
  const orcamentos = await getOrcamentos()

  return (
    <div className="page-content">
      <PageIntro
        title="Orçamentos"
        description="Gerencie orçamentos, itens e status."
        primaryActionLabel="Novo orçamento"
      />

      <div className="page-grid">
        <SectionCard title="Lista de orçamentos">
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
                    <td>{orcamento.numero}</td>
                    <td>{orcamento.clienteNome}</td>
                    <td>{formatMoney(orcamento.total)}</td>
                    <td>{orcamento.situacao}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary">
                          ver
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">
                          editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Formulário de orçamento">
          <form action={salvarOrcamento} className="form-stack">
            <input type="hidden" name="id" value="" />

            <div>
              <label htmlFor="orcamentoCliente" className="form-label">
                Cliente
              </label>
              <select id="orcamentoCliente" name="clienteId" className="form-select" defaultValue="" required>
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
              <label htmlFor="valorDesconto" className="form-label">
                Desconto
              </label>
              <input
                id="valorDesconto"
                name="valorDesconto"
                type="number"
                step="0.01"
                className="form-control"
                defaultValue={0}
              />
            </div>

            <div>
              <label htmlFor="situacao" className="form-label">
                Situação
              </label>
              <select id="situacao" name="situacao" className="form-select" defaultValue="pendente" required>
                <option value="pendente">pendente</option>
                <option value="enviado">enviado</option>
                <option value="aprovado">aprovado</option>
                <option value="rejeitado">rejeitado</option>
                <option value="cancelado">cancelado</option>
              </select>
            </div>

            <div>
              <label htmlFor="orcamentoValidade" className="form-label">
                Válido até
              </label>
              <input id="orcamentoValidade" name="validoAte" type="date" className="form-control" />
            </div>

            <div>
              <label htmlFor="orcamentoObservacoes" className="form-label">
                Observações
              </label>
              <textarea id="orcamentoObservacoes" name="observacoes" className="form-control" rows={3} />
            </div>

            <div className="items-placeholder">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="items-placeholder-title">Itens do orçamento</h4>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => {}}>
                  add item
                </button>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center text-body-secondary py-4">
                        aqui depois vai a lista de itens
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                salvar
              </button>
              <button type="reset" className="btn btn-outline-secondary">
                cancelar
              </button>
            </div>
          </form>
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
  const response = await apiServerFetch('/produtos', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as Produto[]) : []
}

async function getOrcamentos() {
  const response = await apiServerFetch('/orcamentos', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as any[]) : []
}
