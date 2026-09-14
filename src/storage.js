import { STORE_KEY } from './data.js';

export function loadStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

export function saveStored(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    /* almacenamiento no disponible: la demo sigue funcionando en memoria */
  }
}

export function resetStored() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch (e) {}
  location.reload();
}
