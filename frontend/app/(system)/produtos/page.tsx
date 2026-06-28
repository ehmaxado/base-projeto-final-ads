// exemplo de produtos so para montar a tela
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

const produtosExemplo = [
  { codigo: "001", nome: "produto exemplo 1", preco: "00,00", status: "ativo" },
  { codigo: "002", nome: "produto exemplo 2", preco: "00,00", status: "ativo" },
];

// pagina de produtos
export default function ProdutosPage() {
  return (
    <div className="page-content">
      <PageIntro
        title="Aqui e a tela de produtos"
        description="aqui vai a parte de produtos"
        primaryActionLabel="novo produto"
        secondaryActionLabel="filtro"
      />

      <div className="page-grid">
        <SectionCard title="Aqui vai a lista de produtos">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Preco</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {produtosExemplo.map((produto) => (
                  <tr key={produto.codigo}>
                    <td>{produto.codigo}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.preco}</td>
                    <td>{produto.status}</td>
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

        <SectionCard title="Aqui vai o formulario de produtos">
          <form className="form-stack">
            <div>
              <label htmlFor="produtoNome" className="form-label">
                Nome
              </label>
              <input id="produtoNome" name="nome" className="form-control" />
            </div>

            <div>
              <label htmlFor="produtoCodigo" className="form-label">
                Codigo SKU
              </label>
              <input id="produtoCodigo" name="codigoSku" className="form-control" />
            </div>

            <div>
              <label htmlFor="produtoPreco" className="form-label">
                Preco unitario
              </label>
              <input
                id="produtoPreco"
                name="precoUnitario"
                type="number"
                step="0.01"
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="produtoDescricao" className="form-label">
                descricao
              </label>
              <textarea id="produtoDescricao" name="descricao" className="form-control" rows={4} />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary">
                salvar
              </button>
              <button type="button" className="btn btn-outline-secondary">
                limpar
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
