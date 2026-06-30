import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import GraficoPizzaStatus from "@/components/GraficoPizzaStatus";
import GraficoPalitosMes from '@/components/GraficoPalitosMes'
import { apiServerFetch } from "@/lib/api-server";
import GraficoTopClientes from '@/components/GraficoTopClientes/GraficoTopClientes';

type DashboardResumo = {
  totalOrcamentos: number;
  totalClientes: number;
  totalProdutosAtivos: number;
};

type OrcamentoPorStatus = {
  situacao: string;
  total: number;
};

type ValorPorMes = {
  ano: number;
  mes: number;
  total: number;
};

type QuantidadePorMes = {
  ano: number;
  mes: number;
  total: number;
};

type TopCliente = {
  clienteId: number;
  nome: string;
  totalOrcamentos: number;
};

type TopProduto = {
  produtoId: number;
  nome: string;
  totalOcorrencias: number;
};

async function getDashboardData() {
  const anoAtual = new Date().getFullYear();

  const [
    resumoRes,
    statusRes,
    valorMesRes,
    quantidadeRes,
    topClientesRes,
    topProdutosRes,
  ] = await Promise.all([
    apiServerFetch("/dashboard/resumo", { cache: "no-store" }),
    apiServerFetch("/dashboard/orcamentos-por-status", { cache: "no-store" }),
    apiServerFetch(`/dashboard/valor-orcado-por-mes?ano=${anoAtual}`, {
      cache: "no-store",
    }),
    apiServerFetch(`/dashboard/orcamentos-por-mes?ano=${anoAtual}`, {
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

  const [
    resumo,
    status,
    valorMes,
    topClientes,
    topProdutos,
  ] = await Promise.all([
    resumoRes.json() as Promise<DashboardResumo>,
    statusRes.json() as Promise<OrcamentoPorStatus[]>,
    valorMesRes.json() as Promise<ValorPorMes[]>,
    topClientesRes.json() as Promise<TopCliente[]>,
    topProdutosRes.json() as Promise<TopProduto[]>,
  ]);

  const quantidadePorMes = quantidadeRes.ok
    ? ((await quantidadeRes.json()) as QuantidadePorMes[])
    : [];

  return {
    resumo,
    status,
    valorMes,
    quantidadePorMes,
    topClientes,
    topProdutos,
  };
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getUltimoValor(valorMes: ValorPorMes[]) {
  const lista = [...valorMes].reverse();
  const encontrado = lista.find((item) => item.total > 0);
  return encontrado?.total ?? 0;
}

export default async function Home() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="page-content">
        <PageIntro
          title="Dashboard"
          description="Não foi possível carregar os dados do dashboard."
        />

        <SectionCard title="Erro ao carregar o dashboard">
          <p className="mb-0">
            O servidor não respondeu como esperado. Tente atualizar a página ou
            verifique a conexão com a API.
          </p>
        </SectionCard>
      </div>
    );
  }

  const resumoCards = [
    { titulo: "Total de orçamentos", valor: String(data.resumo.totalOrcamentos) },
    { titulo: "Total de clientes", valor: String(data.resumo.totalClientes) },
    { titulo: "Produtos ativos", valor: String(data.resumo.totalProdutosAtivos) },
    {
      titulo: "Último valor por mês",
      valor: formatMoney(getUltimoValor(data.valorMes)),
    },
  ];

  return (
    <div className="page-content">
      <PageIntro
        title="Dashboard"
        description="Visão geral rápida dos indicadores principais de clientes, produtos e orçamentos."
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
        <SectionCard title="Status dos orçamentos">
          <GraficoPizzaStatus dados={data.status} />
        </SectionCard>

      <SectionCard title="Quantidade de orçamentos por mês">
      <div className="placeholder-block">
        <GraficoPalitosMes dados={data.quantidadePorMes} />
      </div>
      </SectionCard>
      </div>

      <div className="page-grid">
        <SectionCard title="Valores por mês">
      <div className="placeholder-block">
        <GraficoPalitosMes dados={data.valorMes} />
      </div>
      </SectionCard>
        

        <SectionCard title="Top clientes">
          <div className="placeholder-block">
            <GraficoTopClientes dados={data.topClientes} />
          </div>
        </SectionCard>
      </div>

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
  );
}
