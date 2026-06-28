// exemplo de clientes so para a tela
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

const clientesExemplo = [
  { nome: "cliente exemplo 1", documento: "000", telefone: "0000" },
  { nome: "cliente exemplo 2", documento: "111", telefone: "1111" },
];

// pagina de clientes
export default function ClientesPage() {
  return (
    <div className="page-content">
      <PageIntro
        title="Aqui e a tela de clientes"
        description="aqui vai a parte de clientes"
        primaryActionLabel="novo cliente"
        secondaryActionLabel="pesquisar"
      />

      <div className="page-grid">
        <SectionCard title="Aqui vai a lista de clientes">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Telefone</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {clientesExemplo.map((cliente) => (
                  <tr key={cliente.documento}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.documento}</td>
                    <td>{cliente.telefone}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary">
                          editar
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger">
                          excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Aqui vai o formulario de clientes">
          <form className="form-stack">
            <div>
              <label htmlFor="clienteNome" className="form-label">
                nome ou razao social
              </label>
              <input id="clienteNome" name="nome" className="form-control" />
            </div>

            <div>
              <label htmlFor="clienteDocumento" className="form-label">
                CPF ou CNPJ
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
                Observacoes
              </label>
              <textarea
                id="clienteObservacoes"
                name="observacoes"
                className="form-control"
                rows={4}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary">
                salvar
              </button>
              <button type="button" className="btn btn-outline-secondary">
                cancelar
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
