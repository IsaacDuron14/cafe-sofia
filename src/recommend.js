import { PRODUCTS } from './data.js';

/**
 * Calcula la recomendación personalizada según las preferencias indicadas
 * y la hora del día. Misma lógica de puntuación que el prototipo aprobado.
 */
export function getRecommendation(prefs) {
  const available = PRODUCTS.filter((p) => p.available);
  const hour = new Date().getHours();

  function score(p) {
    let s = 0;
    if (prefs.temp === 'caliente' && p.cats.includes('caliente')) s += 2;
    if (prefs.temp === 'fria' && p.cats.includes('fria')) s += 2;
    if (prefs.milk === 'leche' && p.milk) s += 2;
    if (prefs.milk === 'sin-leche' && !p.milk) s += 2;
    if (prefs.intensity === 'intenso' && p.intensity >= 4) s += 2;
    if (prefs.intensity === 'suave' && p.intensity <= 2) s += 2;
    if (prefs.sweet === 'dulce' && p.sweet) s += 2;
    if (prefs.sweet === 'sin-azucar' && !p.sweet) s += 2;
    if (hour < 11 && p.cats.includes('caliente')) s += 0.5;
    if (hour >= 14 && p.cats.includes('fria')) s += 0.5;
    return s;
  }

  const ranked = available.map((p) => ({ p, s: score(p) })).sort((a, b) => b.s - a.s);
  const chosen = ranked[0].p;

  const reasons = [];
  if (prefs.temp) reasons.push(prefs.temp === 'caliente' ? 'que lo prefiere caliente' : 'que lo prefiere frío');
  if (prefs.milk) reasons.push(prefs.milk === 'leche' ? 'con leche' : 'sin leche');
  if (prefs.intensity) reasons.push(prefs.intensity === 'intenso' ? 'con más intensidad' : 'más suave');
  if (prefs.sweet) reasons.push(prefs.sweet === 'dulce' ? 'con dulzor' : 'sin azúcar añadida');
  const reasonText = reasons.length ? `porque me indicó ${reasons.join(', ')}` : 'según lo disponible en este momento del día';

  return { product: chosen, reasonText };
}

export function hasAnyPref(prefs) {
  return !!(prefs.temp || prefs.milk || prefs.intensity || prefs.sweet);
}

export function cartSubtotal(cart) {
  return Object.keys(cart).reduce(
    (sum, id) => sum + (cart[id] > 0 ? PRODUCTS.find((p) => p.id === id).price * cart[id] : 0),
    0
  );
}

export function cartTax(cart, rate) {
  return Math.round(cartSubtotal(cart) * rate);
}

export function cartTotal(cart, rate) {
  return cartSubtotal(cart) + cartTax(cart, rate);
}
