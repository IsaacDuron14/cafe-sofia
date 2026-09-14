import { QrIcon, CupIcon, PersonIcon, ShieldIcon, IntelligenceIcon } from './Icons.jsx';

export function QrView({ go }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <div className="qr-box" aria-hidden="true"><QrIcon /></div>
        <h1 className="onboard-title">Escanee el código</h1>
        <p className="onboard-text">
          En el café real, este acceso se abre al escanear el código QR disponible — ya sea en su mesa o en el
          punto de autoservicio. Para esta demostración, simplemente continúe.
        </p>
        <button className="btn btn-primary" onClick={() => go('welcome')}>
          Escanear código{' '}
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, opacity: 0.85 }}>(DEMO)</span>
        </button>
      </div>
    </div>
  );
}

export function WelcomeView({ go }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <CupIcon className="onboard-icon" />
        <h1 className="onboard-title">Bienvenido a Café SofIA</h1>
        <p className="onboard-text">
          Cultura cafetera costarricense, hospitalidad humana e inteligencia artificial, en un mismo lugar. SofIA
          le acompaña — pero quien decide siempre es usted.
        </p>
        <button className="btn btn-primary" onClick={() => go('guest')}>Continuar</button>
      </div>
    </div>
  );
}

export function GuestView({ go }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <PersonIcon className="onboard-icon" />
        <h1 className="onboard-title">Puede comprar sin crear una cuenta</h1>
        <p className="onboard-text">
          No es necesario registrarse para pedir. Puede continuar como invitado y, si quiere, guardar su nombre y
          preferencias más adelante desde Perfil.
        </p>
        <button className="btn btn-primary" onClick={() => go('privacy')}>Continuar como invitado</button>
      </div>
    </div>
  );
}

export function PrivacyView({ go }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <ShieldIcon className="onboard-icon" />
        <h1 className="onboard-title">Aviso de privacidad (demo)</h1>
        <p className="onboard-text">
          En esta demostración, sus datos (carrito, preferencias, progreso) se guardan únicamente en este
          navegador y no se envían a ningún servidor real. Puede borrarlos cuando quiera desde Perfil.
        </p>
        <button className="btn btn-primary" onClick={() => go('ai-info')}>Entendido</button>
      </div>
    </div>
  );
}

export function AiInfoView({ go }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <IntelligenceIcon className="onboard-icon" />
        <h1 className="onboard-title">Está hablando con una inteligencia artificial</h1>
        <p className="onboard-text">
          SofIA es una anfitriona de inteligencia artificial, no una persona. Le ayuda a explorar el menú y
          recomendarle bebidas, siempre de forma transparente.
        </p>
        <button className="btn btn-primary" onClick={() => go('mic-permission')}>Entendido, continuar</button>
      </div>
    </div>
  );
}

export function MicPermissionView({ onSetMicPermission }) {
  return (
    <div className="view active" data-group="onboarding">
      <div className="onboard-wrap">
        <IntelligenceIcon className="onboard-icon" />
        <h1 className="onboard-title">¿Permite el uso del micrófono?</h1>
        <p className="onboard-text">
          Lo usamos solo si decide hablar por voz con SofIA. Si prefiere, puede conversar por texto en cualquier
          momento.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 260 }}>
          <button className="btn btn-primary" onClick={() => onSetMicPermission(true)}>Permitir</button>
          <button className="btn btn-ghost" onClick={() => onSetMicPermission(false)}>Ahora no</button>
        </div>
      </div>
    </div>
  );
}
