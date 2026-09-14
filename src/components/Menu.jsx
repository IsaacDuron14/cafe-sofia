import { useState } from 'react';
import { PRODUCTS, CATEGORY_LABELS } from '../data.js';
import ProductCard from './ProductCard.jsx';

export default function Menu({ onOpenDetail, onAdd, lastCallRecommendation, activeFilter, onSetFilter }) {
  const filtered = activeFilter === 'todas' ? PRODUCTS : PRODUCTS.filter((p) => p.cats.includes(activeFilter));
  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">Menú</h1>
      <p className="lede">Café de altura, taza por taza. La disponibilidad se verifica antes de cada compra.</p>

      <div className="cr-map" aria-hidden="false">
        <svg viewBox="0 0 100 60" role="img" aria-label="Mapa simplificado de Costa Rica con las cuatro regiones cafetaleras del menú">
          <path d="M8 40 Q20 20 38 22 Q55 10 72 18 Q90 22 92 34 Q88 48 68 50 Q40 54 20 50 Q8 48 8 40Z" fill="var(--cream-deep)" stroke="var(--cream-line)" />
          <circle cx="45" cy="30" r="2.6" fill="var(--coral)" />
          <circle cx="38" cy="24" r="2.6" fill="var(--emerald)" />
          <circle cx="33" cy="31" r="2.6" fill="var(--amber)" />
          <circle cx="67" cy="30" r="2.6" fill="var(--tech)" />
        </svg>
        <div className="cr-map-legend">
          <span><i className="cr-dot" style={{ background: 'var(--coral)' }} />Tarrazú</span>
          <span><i className="cr-dot" style={{ background: 'var(--emerald)' }} />Poás</span>
          <span><i className="cr-dot" style={{ background: 'var(--amber)' }} />Naranjo</span>
          <span><i className="cr-dot" style={{ background: 'var(--tech)' }} />Turrialba</span>
        </div>
      </div>

      <div className="filter-row">
        {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`filter-chip ${activeFilter === k ? 'active' : ''}`}
            onClick={() => onSetFilter(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="prod-grid">
        {filtered.length ? (
          filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isRecommended={!!(lastCallRecommendation && lastCallRecommendation.product.id === p.id)}
              onOpenDetail={onOpenDetail}
              onAdd={onAdd}
            />
          ))
        ) : (
          <div className="empty-state"><p>No hay bebidas en esta categoría por ahora.</p></div>
        )}
      </div>
    </div>
  );
}
