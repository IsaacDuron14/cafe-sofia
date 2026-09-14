import { useState } from 'react';
import { CHALLENGES } from '../data.js';

export default function Challenge({ currentChallenge, challengeProgress, onAnswerCorrect, onOpenChallenge, go }) {
  const c = CHALLENGES[currentChallenge];
  const [locked, setLocked] = useState(false);
  const [correctChosen, setCorrectChosen] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);

  function handleAnswer(i, correct) {
    if (locked) return;
    if (correct) {
      setLocked(true);
      setCorrectChosen(true);
      onAnswerCorrect(c);
    } else {
      setWrongIndex(i);
      setTimeout(() => setWrongIndex(null), 350);
    }
  }

  const isLast = currentChallenge === CHALLENGES.length - 1;

  return (
    <div className="view active" data-group="sofia">
      <h1 className="page-title">Desafío {currentChallenge + 1} de {CHALLENGES.length}</h1>
      <p className="lede">Un pequeño reto para aprender mientras espera su café.</p>
      <div>
        <div className="challenge-card">
          <p className="eyebrow2">Desafío · {c.eyebrow}</p>
          <p>{c.question}</p>
          {c.options.map((o, i) => (
            <button
              key={i}
              className={`option-btn ${correctChosen && o.c ? 'correct' : ''} ${wrongIndex === i ? 'wrong' : ''}`}
              onClick={() => handleAnswer(i, o.c)}
            >
              {o.t}
            </button>
          ))}
          <div>
            {locked && (
              <>
                <div className="feedback ok">¡Correcto!</div>
                <div className="learned-card">
                  <p className="eyebrow2">Qué aprendió</p>
                  <p>{c.explain}</p>
                </div>
                {!isLast && (
                  <button className="btn btn-forest" style={{ marginTop: 10 }} onClick={() => onOpenChallenge(currentChallenge + 1)}>
                    Siguiente desafío
                  </button>
                )}
                <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('pulso')}>Ver en El Pulso</button>
              </>
            )}
            {wrongIndex !== null && !locked && (
              <div className="feedback hint">{c.hint} Inténtelo nuevamente.</div>
            )}
          </div>
        </div>
        <div className="progress-dots">
          {CHALLENGES.map((cc, i) => {
            const done = challengeProgress[i];
            return (
              <button
                type="button"
                key={i}
                className="pdot"
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => onOpenChallenge(i)}
                aria-label={`Ir al desafío ${i + 1}: ${cc.eyebrow}`}
              >
                <div className="circ" style={done ? { background: 'var(--emerald)', color: '#fff' } : { background: 'var(--white)', border: '1.5px dashed var(--cream-line)', color: 'var(--coffee-soft)' }}>
                  {done ? '✓' : i + 1}
                </div>
                <span>{cc.eyebrow.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
