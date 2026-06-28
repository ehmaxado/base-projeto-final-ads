// exemplo de orcamentos so para montar a pagina
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

const orcamentosExemplo = [
  { numero: "001", cliente: "cliente 1", total: "00,00", status: "pendente" },
  { numero: "002", cliente: "cliente 2", total: "00,00", status: "aprovado" },
];

// pagina de orcamentos
export default function OrcamentosPage() {
  return (
    <div className="page-content">
      <PageIntro
        title="Aqui e a tela de orcamentos"
        description="aqui vai a parte de orcamentos"
        primaryActionLabel="novo orcamento"
        secondaryActionLabel="buscar"
      />

      <div className="page-grid">
        <SectionCard title="Aqui vai a lista de orcamentos">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {orcamentosExemplo.map((orcamento) => (
                  <tr key={orcamento.numero}>
                    <td>{orcamento.numero}</td>
                    <td>{orcamento.cliente}</td>
                    <td>{orcamento.total}</td>
                    <td>{orcamento.status}</td>
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

        <SectionCard title="Aqui vai o formulario de orcamentos">
          <form className="form-stack">
            <div>
              <label htmlFor="orcamentoCliente" className="form-label">
                cliente
              </label>
              <select id="orcamentoCliente" name="clienteId" className="form-select" defaultValue="">
                <option value="" disabled>
                  escolha um cliente
                </option>
                <option value="1">cliente 1</option>
                <option value="2">cliente 2</option>
              </select>
            </div>

            <div>
              <label htmlFor="orcamentoValidade" className="form-label">
                Valido ate
              </label>
              <input id="orcamentoValidade" name="validoAte" type="date" className="form-control" />
            </div>

            <div>
              <label htmlFor="orcamentoObservacoes" className="form-label">
                Observacoes
              </label>
              <textarea
                id="orcamentoObservacoes"
                name="observacoes"
                className="form-control"
                rows={3}
              />
            </div>

            <div className="items-placeholder">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="items-placeholder-title">Aqui vai a parte dos itens</h4>
                <button type="button" className="btn btn-outline-primary btn-sm">
                  add item
                </button>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preco</th>
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
