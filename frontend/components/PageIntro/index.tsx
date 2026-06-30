// props da parte de cima da pagina
type PageIntroProps = {
  title: string;
  description: string;
};

// componente do topo da pagina
export default function PageIntro({
  title,
  description,
}: PageIntroProps) {
  return (
    <section className="page-panel page-header">
      <div>
        <h2 className="page-title">{title}</h2>
        <p className="page-description mb-0">{description}</p>
      </div>
    </section>
  );
}
