import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Cliente, salvarCliente, excluirCliente } from './actions'

async function getClientes() {
  const response = await apiServerFetch('/clientes', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as Cliente[]) : []
}

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="page-content">
      <PageIntro
        title="Clientes"
        description="Gerencie os clientes cadastrados no sistema."
        primaryActionLabel="Novo cliente"
      />

      <div className="page-grid">
        <SectionCard title="Lista de clientes">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.documento ?? '-'}</td>
                    <td>{cliente.email ?? '-'}</td>
                    <td>{cliente.telefone ?? '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => window.location.href = `#cliente-${cliente.id}`}
                        >
                          editar
                        </button>
                        <form action={excluirCliente} method="post">
                          <input type="hidden" name="id" value={cliente.id} />
                          <button type="submit" className="btn btn-sm btn-outline-danger">
                            excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Formulário de cliente">
          <form action={salvarCliente} className="form-stack" id="cliente-form">
            <input type="hidden" name="id" value="" />

            <div>
              <label htmlFor="clienteNome" className="form-label">
                Nome ou razão social
              </label>
              <input id="clienteNome" name="nome" className="form-control" required />
            </div>

            <div>
              <label htmlFor="clienteDocumento" className="form-label">
                Documento
              </label>
              <input id="clienteDocumento" name="documento" className="form-control" />
            </div>

            <div>
              <label htmlFor="clienteEmail" className="form-label">
                Email
              </label>
              <input id="clienteEmail" name="email" type="email" className="form-control" />
            </div>

            <div>
              <label htmlFor="clienteTelefone" className="form-label">
                Telefone
              </label>
              <input id="clienteTelefone" name="telefone" className="form-control" />
            </div>

            <div>
              <label htmlFor="clienteObservacoes" className="form-label">
                Observações
              </label>
              <textarea
                id="clienteObservacoes"
                name="observacoes"
                className="form-control"
                rows={4}
              />
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
