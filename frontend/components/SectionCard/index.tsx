// props do bloco da pagina
type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

// componente de bloco simples
export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="page-panel">
      <div className="section-card-header">
        <h3 className="section-card-title">{title}</h3>
      </div>
      {children}
    </section>
  );
}
