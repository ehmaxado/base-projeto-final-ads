// props da parte de cima da pagina
type PageIntroProps = {
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

// componente do topo da pagina
export default function PageIntro({
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
}: PageIntroProps) {
  return (
    <section className="page-panel page-header">
      <div>
        <h2 className="page-title">{title}</h2>
        <p className="page-description mb-0">{description}</p>
      </div>

      <div className="page-actions">
        {secondaryActionLabel ? (
          <button type="button" className="btn btn-outline-secondary">
            {secondaryActionLabel}
          </button>
        ) : null}
        {primaryActionLabel ? (
          <button type="button" className="btn btn-primary">
            {primaryActionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
