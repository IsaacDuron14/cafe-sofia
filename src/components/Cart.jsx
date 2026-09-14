import { PRODUCTS, SERVICE_TAX_RATE, money } from '../data.js';
import { PRODUCT_ICONS, XIcon } from './Icons.jsx';
import { cartSubtotal } from '../recommend.js';

export default function Cart({ cart, go, onChangeQty, onRemove }) {
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  if (!ids.length) {
    return (
      <div className="view active" data-group="menu">
        <h1 className="page-title">Su carrito</h1>
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <p>Su carrito está vacío.<br />Explore el menú para empezar.</p>
          <button className="btn btn-primary" onClick={() => go('menu')}>Ver menú</button>
        </div>
      </div>
    );
  }

  const subtotal = cartSubtotal(cart);
  const tax = Math.round(subtotal * SERVICE_TAX_RATE);

  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">Su carrito</h1>
      <div>
        {ids.map((id) => {
          const p = PRODUCTS.find((x) => x.id === id);
          const Icon = PRODUCT_ICONS[p.icon];
          return (
            <div className="cart-item" key={id}>
              <div className="swatch" style={{ width: 40, height: 40, background: p.bg, color: p.accent }}>
                <Icon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="name" style={{ margin: 0 }}>{p.name}</p>
                <div className="cart-qty">
                  <button onClick={() => onChangeQty(id, -1)} aria-label={`Disminuir cantidad de ${p.name}`}>−</button>
                  <span className="meta">Cant. {cart[id]}</span>
                  <button onClick={() => onChangeQty(id, 1)} aria-label={`Aumentar cantidad de ${p.name}`}>+</button>
                </div>
              </div>
              <span className="price">{money(p.price * cart[id])}</span>
              <button className="cart-remove" onClick={() => onRemove(id)} aria-label={`Quitar ${p.name} del carrito`}>
                <XIcon width="16" height="16" />
              </button>
            </div>
          );
        })}
        <div className="totals-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="totals-row"><span>Cargo por servicio (10%, provisional)</span><span>{money(tax)}</span></div>
        <span className="pending-note">Tarifa por validar con administración</span>
        <div className="totals-row total"><span>Total</span><span>{money(subtotal + tax)}</span></div>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => go('confirm')}>Confirmar pedido</button>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('menu')}>Seguir viendo el menú</button>
      </div>
    </div>
  );
}
