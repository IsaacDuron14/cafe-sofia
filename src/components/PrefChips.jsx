import { PREF_GROUPS } from '../data.js';

/**
 * Chips de preferencia reutilizables (temperatura, leche, intensidad, dulzor).
 * Volver a pulsar el valor ya seleccionado lo deselecciona.
 */
export default function PrefChips({ prefs, onPick }) {
  return (
    <>
      {PREF_GROUPS.map((g) => (
        <div className="pref-group" key={g.key}>
          <p className="pref-label">{g.label}</p>
          <div className="pref-options">
            {g.options.map((o) => (
              <button
                key={o.v}
                type="button"
                className={`pref-chip ${prefs[g.key] === o.v ? 'selected' : ''}`}
                onClick={() => onPick(g.key, o.v)}
              >
                {o.t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
