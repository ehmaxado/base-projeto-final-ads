import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { Produto } from './actions'
import ExcluirProdutoButton from './excluir-produto-button'
import ProdutoModalForm from './produto-modal-form'

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
      />

      <div className="page-grid page-grid--full">
        <SectionCard title="Lista de produtos">
          <div className="d-flex justify-content-end mb-3">
            <ProdutoModalForm />
          </div>

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
                        <ProdutoModalForm produto={produto} />
                        <ExcluirProdutoButton
                          produtoId={produto.id}
                          produtoNome={produto.nome}
                        />
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
