import { useState } from 'react';
import PrefChips from './PrefChips.jsx';

export default function Perfil({ prefs, onPickPref, onSaveName, go, onConfirmReset }) {
  const [name, setName] = useState(prefs.name || '');

  return (
    <div className="view active" data-group="perfil">
      <h1 className="page-title">Su perfil</h1>
      <p className="lede">Todo esto se guarda solo en este navegador, para esta demostración <span style={{ color: 'var(--amber)' }}>· DEMO</span>.</p>
      <p className="field-label" style={{ marginTop: 0 }}>¿Cómo le llamamos?</p>
      <input
        className="text-field"
        type="text"
        placeholder="Su nombre (opcional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="field-label">Sus preferencias de café</p>
      <PrefChips prefs={prefs} onPick={onPickPref} />
      <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={() => onSaveName(name.trim())}>Guardar</button>

      <p className="section-label" style={{ marginTop: 20 }}>Más información</p>
      <button className="btn btn-ghost" onClick={() => go('historial')}>Ver historial de pedidos (demo)</button>
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('challenges-progress')}>Ver progreso de desafíos</button>
      <button className="reset-link" onClick={onConfirmReset}>Reiniciar datos de esta demostración</button>
    </div>
  );
}
