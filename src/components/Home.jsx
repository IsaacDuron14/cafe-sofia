import { PRODUCTS } from '../data.js';
import ProductCard from './ProductCard.jsx';
import { MenuIcon, IntelligenceIcon } from './Icons.jsx';

export default function Home({ go, onOpenDetail, onAdd, lastCallRecommendation }) {
  const recs = PRODUCTS.filter((p) => p.available).slice(0, 2);
  return (
    <div className="view active" data-group="inicio">
      <div className="hero-card">
        <span className="tag">Anfitriona digital</span>
        <h2>Hola, soy SofIA</h2>
        <p>Escucho, oriento y recomiendo con transparencia. Pídame lo que quiera probar hoy, o explore el menú usted mismo.</p>
      </div>
      <p className="section-label">Empiece por acá</p>
      <div className="quicklinks">
        <button className="qlink" onClick={() => go('menu')}>
          <MenuIcon />
          <b>Ver el menú</b><span>4 bebidas de altura</span>
        </button>
        <button className="qlink" onClick={() => go('sofia')}>
          <IntelligenceIcon />
          <b>Hablar con SofIA</b><span>voz o texto</span>
        </button>
      </div>
      <p className="section-label">Recomendado para usted</p>
      <div className="prod-grid">
        {recs.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isRecommended={!!(lastCallRecommendation && lastCallRecommendation.product.id === p.id)}
            onOpenDetail={onOpenDetail}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}
