import { useEffect, useState } from 'react';
import { PRODUCTS } from '../data.js';
import { PRODUCT_ICONS, CheckIcon, XIcon, IntelligenceIcon } from './Icons.jsx';
import { money } from '../data.js';

/**
 * Vista de detalle de un producto. Simula una verificación de stock de 900ms
 * (igual que el prototipo aprobado) antes de habilitar "Agregar al carrito"
 * o mostrar el estado "Agotado" con una alternativa disponible.
 */
export default function Detail({ productId, go, onAdd, pushPulso }) {
  const p = PRODUCTS.find((x) => x.id === productId);
  const alt = p ? PRODUCTS.find((x) => x.available && x.id !== p.id) : null;
  const [checking, setChecking] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!p) return undefined;
    setChecking(true);
    setQty(1);
    const t = setTimeout(() => {
      setChecking(false);
      if (p.available) {
        pushPulso({
          detecto: `Consulta de disponibilidad para ${p.name}`,
          decidio: 'Confirmar stock antes de mostrar el botón de compra',
          actuo: 'Revisó el inventario simulado',
          registro: `Disponible — ${p.name} listo para agregar al carrito`,
        });
      } else {
        pushPulso({
          detecto: `Consulta de disponibilidad para ${p.name}`,
          decidio: 'No ofrecer un producto sin stock; buscar alternativa disponible',
          actuo: `Revisó el inventario y sugirió ${alt ? alt.name : 'otra opción'}`,
          registro: 'Agotado — alternativa mostrada al cliente',
        });
      }
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (!p) return null;
  const Icon = PRODUCT_ICONS[p.icon];

  return (
    <div className="view active" data-group="menu">
      <div className="detail-hero" style={{ background: p.bg, color: p.accent }}>
        <Icon />
        <span className="demo-tag">DEMO</span>
      </div>
      <h1 className="page-title">{p.name}</h1>
      <p className="lede">{p.region} · {money(p.price)} · {p.size}</p>
      <div className="prod-badges" style={{ marginBottom: 8 }}>
        {p.notes.map((n) => <span className="tag-chip" key={n}>{n}</span>)}
      </div>
      <p style={{ fontSize: 13, color: 'var(--coffee)', lineHeight: 1.55, margin: '0 0 4px' }}>{p.desc}</p>

      <div className="stock-row">
        {checking ? (
          <>
            <div className="spinner" /><span>Verificando disponibilidad…</span>
          </>
        ) : p.available ? (
          <>
            <CheckIcon width="14" height="14" stroke="var(--emerald)" strokeWidth="2.2" />
            <span style={{ color: 'var(--emerald)' }}>Disponible — stock confirmado</span>
          </>
        ) : (
          <>
            <XIcon width="14" height="14" stroke="var(--coral)" strokeWidth="2.2" />
            <span style={{ color: 'var(--coral)' }}>Agotado por hoy</span>
          </>
        )}
      </div>

      {!checking && !p.available && alt && (
        <div className="alt-card">
          <IntelligenceIcon />
          <span><b>SofIA recomienda:</b> pruebe {alt.name} ({alt.region}), disponible ahora por {money(alt.price)}.</span>
        </div>
      )}

      {!checking && p.available && (
        <div className="stepper">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Disminuir cantidad">−</button>
          <span className="qty">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar cantidad">+</button>
        </div>
      )}

      <button
        className="btn btn-primary"
        style={{ marginTop: 'auto' }}
        disabled={checking || !p.available}
        onClick={() => onAdd(p.id, qty)}
      >
        {checking ? 'Verificando…' : p.available ? 'Agregar al carrito' : 'No disponible'}
      </button>
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('menu')}>Volver al menú</button>
    </div>
  );
}
