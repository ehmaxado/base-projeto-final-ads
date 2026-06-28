// pagina da home
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { apiServerFetch } from "@/lib/api-server";

// tipo do resumo
type DashboardResumo = {
  totalOrcamentos: number;
  totalClientes: number;
  totalProdutosAtivos: number;
};

// tipo do status
type OrcamentoPorStatus = {
  situacao: string;
  total: number;
};

// tipo do valor por mes
type ValorPorMes = {
  ano: number;
  mes: number;
  total: number;
};

// tipo do top cliente
type TopCliente = {
  clienteId: number;
  nome: string;
  totalOrcamentos: number;
};

// tipo do top produto
type TopProduto = {
  produtoId: number;
  nome: string;
  totalOcorrencias: number;
};

// funcao para pegar dados da api
async function getDashboardData() {
  const anoAtual = new Date().getFullYear();

  const [resumoRes, statusRes, valorMesRes, topClientesRes, topProdutosRes] =
    await Promise.all([
      apiServerFetch("/dashboard/resumo", { cache: "no-store" }),
      apiServerFetch("/dashboard/orcamentos-por-status", { cache: "no-store" }),
      apiServerFetch(`/dashboard/valor-orcado-por-mes?ano=${anoAtual}`, {
        cache: "no-store",
      }),
      apiServerFetch("/dashboard/top-clientes-orcamentos?limit=5", {
        cache: "no-store",
      }),
      apiServerFetch("/dashboard/top-produtos-orcados?limit=5", {
        cache: "no-store",
      }),
    ]);

  if (
    !resumoRes.ok ||
    !statusRes.ok ||
    !valorMesRes.ok ||
    !topClientesRes.ok ||
    !topProdutosRes.ok
  ) {
    return null;
  }

  const [resumo, status, valorMes, topClientes, topProdutos] = await Promise.all([
    resumoRes.json() as Promise<DashboardResumo>,
    statusRes.json() as Promise<OrcamentoPorStatus[]>,
    valorMesRes.json() as Promise<ValorPorMes[]>,
    topClientesRes.json() as Promise<TopCliente[]>,
    topProdutosRes.json() as Promise<TopProduto[]>,
  ]);

  return {
    resumo,
    status,
    valorMes,
    topClientes,
    topProdutos,
  };
}

// formatar dinheiro
function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// pegar o ultimo valor
function getUltimoValor(valorMes: ValorPorMes[]) {
  const lista = [...valorMes].reverse();
  const encontrado = lista.find((item) => item.total > 0);
  return encontrado?.total ?? 0;
}

// pagina home
export default async function Home() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="page-content">
        <PageIntro
          title="Dashboard do Sistema sem nome"
          description="Nao foi possivel carregar os dados do dashboard."
        />

        <SectionCard title="Dashboard do Sistema sem nome">
          <p className="mb-0">A API nao respondeu como esperado.</p>
        </SectionCard>
      </div>
    );
  }

  const resumoCards = [
    { titulo: "Total de orcamentos", valor: String(data.resumo.totalOrcamentos) },
    { titulo: "Total de clientes", valor: String(data.resumo.totalClientes) },
    { titulo: "Produtos ativos", valor: String(data.resumo.totalProdutosAtivos) },
    { titulo: "Ultimo valor por mes", valor: formatMoney(getUltimoValor(data.valorMes)) },
  ];

  return (
    <div className="page-content">
      <PageIntro
        title="Dashboard do Sistema sem nome"
        description="Aqui ficam os dados principais do Sistema sem nome."
      />

      <section className="dashboard-grid">
        {resumoCards.map((card) => (
          <article key={card.titulo} className="summary-card">
            <p className="summary-card-label">{card.titulo}</p>
            <strong className="summary-card-value">{card.valor}</strong>
          </article>
        ))}
      </section>

      <div className="page-grid">
        <SectionCard title="Status dos orcamentos">
          <div className="placeholder-block">
            <ul className="mb-0">
              {data.status.map((item) => (
                <li key={item.situacao}>
                  {item.situacao}: {item.total}
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Valores por mes">
          <div className="placeholder-block">
            <ul className="mb-0">
              {data.valorMes.map((item) => (
                <li key={`${item.ano}-${item.mes}`}>
                  Mes {item.mes}: {formatMoney(item.total)}
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>

      <div className="page-grid">
        <SectionCard title="Top clientes">
          <div className="placeholder-block">
            <ul className="mb-0">
              {data.topClientes.length > 0 ? (
                data.topClientes.map((item) => (
                  <li key={item.clienteId}>
                    {item.nome}: {item.totalOrcamentos}
                  </li>
                ))
              ) : (
                <li>Sem dados de clientes.</li>
              )}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Top produtos">
          <div className="placeholder-block">
            <ul className="mb-0">
              {data.topProdutos.length > 0 ? (
                data.topProdutos.map((item) => (
                  <li key={item.produtoId}>
                    {item.nome}: {item.totalOcorrencias}
                  </li>
                ))
              ) : (
                <li>Sem dados de produtos.</li>
              )}
            </ul>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
