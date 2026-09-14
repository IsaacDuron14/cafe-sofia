export default function PickupConfirm({ go }) {
  return (
    <div className="view active" data-group="menu">
      <div className="onboard-wrap">
        <svg className="onboard-icon" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
        </svg>
        <h1 className="onboard-title">¡Gracias por su visita!</h1>
        <p className="onboard-text">Quedó registrado que retiró su pedido en el mostrador.</p>
        <button className="btn btn-primary" onClick={() => go('survey')}>Responder encuesta breve (1 min)</button>
        <button className="btn btn-ghost" onClick={() => go('home')}>Volver al inicio</button>
      </div>
    </div>
  );
}
