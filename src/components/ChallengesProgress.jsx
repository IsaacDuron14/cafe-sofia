import { CHALLENGES } from '../data.js';

export default function ChallengesProgress({ challengeProgress, onOpenChallenge, go }) {
  const count = challengeProgress.filter(Boolean).length;
  return (
    <div className="view active" data-group="perfil">
      <h1 className="page-title">Progreso de desafíos</h1>
      <p className="lede">Ha completado <b>{count}</b> de 5 desafíos.</p>
      <div>
        {CHALLENGES.map((c, i) => (
          <button type="button" className="prog-card" key={i} onClick={() => onOpenChallenge(i)}>
            <div
              className="swatch"
              style={{
                background: challengeProgress[i] ? 'rgba(34,178,94,.15)' : 'var(--cream)',
                color: challengeProgress[i] ? 'var(--emerald)' : 'var(--coffee-soft)',
              }}
            >
              {challengeProgress[i] ? '✓' : i + 1}
            </div>
            <div className="prod-info">
              <p className="name">{c.eyebrow}</p>
              <p className="origin">{challengeProgress[i] ? 'Completado' : 'Pendiente'}</p>
            </div>
          </button>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => go('perfil')}>Volver a mi perfil</button>
    </div>
  );
}
