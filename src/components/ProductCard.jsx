import { PRODUCT_ICONS } from './Icons.jsx';
import { money } from '../data.js';

/**
 * Tarjeta de producto usada en Inicio y en el Menú.
 * Muestra nombre, región, notas de sabor, medidor de intensidad,
 * precio/tamaño, chip de disponibilidad y botón de agregado rápido.
 */
export default function ProductCard({ product: p, isRecommended, onOpenDetail, onAdd }) {
  const Icon = PRODUCT_ICONS[p.icon];
  return (
    <div className="prod-card">
      <button
        type="button"
        className="prod-main"
        onClick={() => onOpenDetail(p.id)}
        aria-label={`Ver detalle de ${p.name}`}
      >
        <div className="swatch" style={{ background: p.bg, color: p.accent }}>
          <Icon />
        </div>
        <div className="prod-info">
          <p className="name">{p.name}</p>
          <p className="origin">{p.region}</p>
          <div className="prod-badges">
            {p.notes.map((n) => (
              <span className="tag-chip" key={n}>{n}</span>
            ))}
            {isRecommended && <span className="sofia-badge">Recomendado por SofIA</span>}
          </div>
          <div className="intensity-meter" aria-label={`Intensidad ${p.intensity} de 5`} style={{ marginTop: 5 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <i className={n <= p.intensity ? 'on' : ''} key={n} />
            ))}
          </div>
          <p className="price" style={{ marginTop: 5 }}>{money(p.price)} · {p.size}</p>
        </div>
      </button>
      <div className="prod-actions">
        <span className={`stock-chip ${p.available ? 'ok' : 'out'}`}>{p.available ? 'Disponible' : 'Agotado'}</span>
        <button className="add-chip-btn" disabled={!p.available} onClick={() => onAdd(p.id, 1)}>Agregar</button>
      </div>
    </div>
  );
}
