import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Cliente, excluirCliente } from './actions'
import ClienteModalForm from './cliente-modal-form'

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
      />

      <div className="page-grid page-grid--full">
        <SectionCard title="Lista de clientes">
          <div className="d-flex justify-content-end mb-3">
            <ClienteModalForm />
          </div>

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
                        <ClienteModalForm cliente={cliente} />
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
      </div>
    </div>
  )
}
