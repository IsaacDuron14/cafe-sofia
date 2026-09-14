import { PRODUCTS, PAY_METHODS, money } from '../data.js';

export default function Receipt({ lastOrder, go }) {
  if (!lastOrder) return null;
  const payLabel = (PAY_METHODS.find((m) => m.id === lastOrder.method) || {}).label || '—';
  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">¡Pedido confirmado!</h1>
      <div className="receipt-card">
        <svg className="big-check" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
        </svg>
        <p className="order-no">Pedido {lastOrder.orderNo} · <span style={{ color: 'var(--amber)' }}>DEMO</span></p>
        <div className="totals-row"><span>Método de pago</span><span>{payLabel}</span></div>
        <div style={{ margin: '10px 0' }}>
          {Object.entries(lastOrder.items).map(([id, qty]) => {
            const p = PRODUCTS.find((x) => x.id === id);
            return (
              <div className="totals-row" key={id}><span>{qty}× {p.name}</span><span>{money(p.price * qty)}</span></div>
            );
          })}
        </div>
        <div className="totals-row total"><span>Total pagado</span><span>{money(lastOrder.total)}</span></div>
      </div>
      <button className="btn btn-forest" onClick={() => go('status')}>Ver estado del pedido</button>
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('home')}>Volver al inicio</button>
    </div>
  );
}
