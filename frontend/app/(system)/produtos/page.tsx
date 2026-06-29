import { cookies } from 'next/headers'
import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Produto, salvarProduto, excluirProduto } from './actions'

async function getProdutos() {
  const response = await apiServerFetch('/produtos', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as Produto[]) : []
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default async function ProdutosPage() {
  const produtos = await getProdutos()

  return (
    <div className="page-content">
      <PageIntro
        title="Produtos"
        description="Gerencie os produtos cadastrados no sistema."
        primaryActionLabel="Novo produto"
      />

      <div className="page-grid">
        <SectionCard title="Lista de produtos">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Unidade</th>
                  <th>Ativo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.codigoSku ?? '-'}</td>
                    <td>{produto.nome}</td>
                    <td>{formatMoney(produto.precoUnitario)}</td>
                    <td>{produto.unidade}</td>
                    <td>{produto.ativo ? 'Sim' : 'Não'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            window.location.href = `#produto-${produto.id}`
                          }}
                        >
                          editar
                        </button>
                        <form action={excluirProduto} method="post">
                          <input type="hidden" name="id" value={produto.id} />
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

        <SectionCard title="Formulário de produto">
          <form action={salvarProduto} className="form-stack">
            <input type="hidden" name="id" value="" />

            <div>
              <label htmlFor="produtoNome" className="form-label">
                Nome
              </label>
              <input id="produtoNome" name="nome" className="form-control" required />
            </div>

            <div>
              <label htmlFor="produtoCodigo" className="form-label">
                Código SKU
              </label>
              <input id="produtoCodigo" name="codigoSku" className="form-control" />
            </div>

            <div>
              <label htmlFor="produtoPreco" className="form-label">
                Preço unitário
              </label>
              <input
                id="produtoPreco"
                name="precoUnitario"
                type="number"
                step="0.01"
                className="form-control"
                required
              />
            </div>

            <div>
              <label htmlFor="produtoUnidade" className="form-label">
                Unidade
              </label>
              <input id="produtoUnidade" name="unidade" className="form-control" defaultValue="UN" required />
            </div>

            <div>
              <label htmlFor="produtoDescricao" className="form-label">
                Descrição
              </label>
              <textarea id="produtoDescricao" name="descricao" className="form-control" rows={4} />
            </div>

            <div className="form-check">
              <input id="produtoAtivo" name="ativo" type="checkbox" className="form-check-input" />
              <label htmlFor="produtoAtivo" className="form-check-label">
                Ativo
              </label>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                salvar
              </button>
              <button type="reset" className="btn btn-outline-secondary">
                limpar
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
