import { money } from '../data.js';

export default function Historial({ orderHistory, go }) {
  return (
    <div className="view active" data-group="perfil">
      <h1 className="page-title">Historial de pedidos</h1>
      <p className="lede">Pedidos realizados durante esta demostración <span style={{ color: 'var(--amber)' }}>· DEMO</span></p>
      {!orderHistory.length ? (
        <div className="empty-state"><p>Todavía no tiene pedidos en esta demostración.</p></div>
      ) : (
        orderHistory.slice().reverse().map((o, i) => (
          <div className="history-card" key={i}>
            <div className="hrow"><span>{o.orderNo}</span><span>{money(o.total)}</span></div>
            <div className="hmeta">{o.count} producto(s) · {o.methodLabel} · {o.when} <span style={{ color: 'var(--amber)' }}>· DEMO</span></div>
          </div>
        ))
      )}
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('perfil')}>Volver a mi perfil</button>
    </div>
  );
}
