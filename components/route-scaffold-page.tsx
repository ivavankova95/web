type RouteScaffoldPageProps = {
  title: string;
  routePath: string;
  routeType: string;
  layout: string;
  notes: string[];
  children?: React.ReactNode;
};

export function RouteScaffoldPage({
  title,
  routePath,
  routeType,
  layout,
  notes,
  children
}: RouteScaffoldPageProps) {
  return (
    <section className="page-section">
      <div className="container page-grid">
        <div className="surface-card" style={{ padding: "2rem" }}>
          <p className="eyebrow">{layout}</p>
          <h1>{title}</h1>
          <p className="page-lead">
            Route scaffold pro migraci stareho Webflow webu do Next.js + Sanity + Stripe.
          </p>
          <div className="code-block">
            {JSON.stringify({ routePath, routeType, layout }, null, 2)}
          </div>
        </div>
        <div className="surface-card" style={{ padding: "2rem" }}>
          <h2>Poznámky k implementaci</h2>
          <ul>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </section>
  );
}

