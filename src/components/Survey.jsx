import { useState } from 'react';

export default function Survey({ go, pushPulso }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  function submit() {
    pushPulso(
      'Encuesta final recibida',
      'Registrar la opinión del cliente sobre su visita',
      `Calificación ${stars || 'sin calificar'} de 5`,
      'Encuesta registrada — DEMO'
    );
    setSent(true);
  }

  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">Encuesta breve</h1>
      <p className="lede">Nos ayuda a mejorar. Totalmente simulada para esta demostración <span style={{ color: 'var(--amber)' }}>· DEMO</span>.</p>
      <p className="field-label" style={{ marginTop: 0 }}>¿Cómo calificaría su experiencia?</p>
      <div className="star-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-btn ${n <= stars ? 'on' : ''}`}
            onClick={() => setStars(n)}
            aria-label={`${n} estrella${n > 1 ? 's' : ''} de 5`}
          >★</button>
        ))}
      </div>
      <p className="field-label">¿Algo que quiera contarnos? (opcional)</p>
      <textarea
        className="text-field"
        rows="3"
        placeholder="Escriba aquí…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={submit}>Enviar</button>
      {sent && <p style={{ fontSize: 13, color: 'var(--emerald)', marginTop: 10 }}>¡Gracias por su opinión!</p>}
      <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => go('home')}>Volver al inicio</button>
    </div>
  );
}
