export default function Pulso({ pulsoLog }) {
  return (
    <div className="view active" data-group="pulso">
      <h1 className="page-title">El Pulso de SofIA</h1>
      <p className="lede">
        Cada vez que SofIA actúa, así es como lo explica: qué notó, qué decidió, qué hizo y qué quedó registrado.
        Sin razonamientos internos ni datos sensibles.
      </p>
      {!pulsoLog.length ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h4l2-7 4 14 3-9 2 4h5" /></svg>
          <p>Todavía no hay actividad. Navegue el menú o hable con SofIA para ver acá cómo actúa.</p>
        </div>
      ) : (
        pulsoLog.map((e, i) => (
          <div className="pulso-entry" key={i}>
            <div className="pulso-head"><span className="pulso-time">{e.time}</span><span className="pulso-demo">DEMO</span></div>
            <div className="pulso-row"><span className="k">Detectó</span><span className="v">{e.detecto}</span></div>
            <div className="pulso-row"><span className="k">Decidió</span><span className="v">{e.decidio}</span></div>
            <div className="pulso-row"><span className="k">Actuó</span><span className="v">{e.actuo}</span></div>
            <div className="pulso-row"><span className="k">Registró</span><span className="v">{e.registro}</span></div>
          </div>
        ))
      )}
    </div>
  );
}
