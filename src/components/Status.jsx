import { useEffect, useState } from 'react';
import { CheckIcon } from './Icons.jsx';

const STEPS = [
  { label: 'Recibido', sub: 'Su pedido llegó a la cocina' },
  { label: 'Preparando', sub: 'SofIA avisó al barista' },
  { label: 'Listo para retirar', sub: 'Ya puede pasar por él al mostrador' },
];

export default function Status({ lastOrder, go, pushPulso, onConfirmPickup }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 1800);
    const t2 = setTimeout(() => {
      setStep(2);
      pushPulso({
        detecto: 'Preparación finalizada',
        decidio: 'Notificar al cliente que su pedido está listo',
        actuo: 'Actualizó el estado del pedido',
        registro: 'Listo para retirar — DEMO',
      });
    }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">Estado del pedido</h1>
      <p className="lede">{lastOrder ? `Pedido ${lastOrder.orderNo}` : ''}</p>
      <div className="track">
        {STEPS.map((s, i) => {
          const cls = i < step ? 'done' : i === step ? 'now' : '';
          return (
            <div className={`track-step ${cls}`} key={s.label}>
              <div className="line" />
              <div className="dot-ring">{i < step ? <CheckIcon strokeWidth="3" /> : i + 1}</div>
              <div className="track-txt"><b>{s.label}</b><span>{s.sub}</span></div>
            </div>
          );
        })}
      </div>
      <div style={{ margin: '4px 0 12px' }}>
        {step === 2 && (
          <button className="btn btn-forest" onClick={onConfirmPickup}>Confirmar que retiré mi pedido</button>
        )}
      </div>
      <button className="btn btn-ghost" onClick={() => go('home')}>Volver al inicio</button>
    </div>
  );
}
