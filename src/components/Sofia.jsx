import { useEffect, useRef, useState } from 'react';
import PrefChips from './PrefChips.jsx';
import { hasAnyPref, getRecommendation } from '../recommend.js';
import { PhoneIcon, SendIcon, XIcon } from './Icons.jsx';
import avatarSrc from '../assets/sofia-avatar.webp';

function RecommendationText({ product, reasonText }) {
  return (
    <>
      Le recomiendo el <b>{product.name}</b> ({product.region}) — {reasonText}. {product.desc}
    </>
  );
}

function DemoTag() {
  return <span style={{ color: 'var(--amber)', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9 }}>DEMO</span>;
}

export default function Sofia({
  sofiaMode, onSetMode,
  chatStarted, lastUserText, onSendText,
  prefs, onPickPref,
  onAddToCart, go, pushPulso,
  call, callActions,
}) {
  return (
    <div className="view active" data-group="sofia">
      <h1 className="page-title">Converse con SofIA</h1>
      <div className="mode-toggle">
        <button className={sofiaMode === 'voz' ? 'active' : ''} onClick={() => onSetMode('voz')}>📞 Llamada</button>
        <button className={sofiaMode === 'texto' ? 'active' : ''} onClick={() => onSetMode('texto')}>⌨️ Texto</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {sofiaMode === 'voz' ? (
          <CallStage
            call={call}
            callActions={callActions}
            prefs={prefs}
            onPickPref={onPickPref}
            onAddToCart={onAddToCart}
            go={go}
          />
        ) : (
          <TextChat
            chatStarted={chatStarted}
            lastUserText={lastUserText}
            onSendText={onSendText}
            prefs={prefs}
            onPickPref={onPickPref}
            onAddToCart={onAddToCart}
            go={go}
            pushPulso={pushPulso}
          />
        )}
      </div>
    </div>
  );
}

function TextChat({ chatStarted, lastUserText, onSendText, prefs, onPickPref, onAddToCart, go, pushPulso }) {
  const [input, setInput] = useState('');
  const [stage, setStage] = useState(() => (chatStarted ? (hasAnyPref(prefs) ? 'done' : 'ask') : 'input'));
  const pushedRef = useRef(false);

  function handleSend() {
    const text = input.trim() || '¿Qué me recomienda para esta tarde?';
    onSendText(text);
    setInput('');
    setStage(hasAnyPref(prefs) ? 'done' : 'ask');
  }

  useEffect(() => {
    if (stage === 'done' && !pushedRef.current) {
      pushedRef.current = true;
      const rec = getRecommendation(prefs);
      pushPulso({
        detecto: `Consulta del cliente: "${lastUserText}"`,
        decidio: 'Recomendar una bebida disponible según sus preferencias y el momento del día',
        actuo: `Sugirió ${rec.product.name}`,
        registro: 'Recomendación entregada — DEMO',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (stage === 'input') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="chat-log" />
        <div className="text-row">
          <input
            type="text"
            placeholder="Escríbale algo a SofIA…"
            aria-label="Escriba su mensaje para SofIA"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button className="send-btn" aria-label="Enviar mensaje" onClick={handleSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'ask') {
    return (
      <div>
        <div className="chat-log">
          <div className="bubble user">{lastUserText}</div>
          <div className="bubble sofia">Con gusto. Para recomendarle bien, ¿cómo lo prefiere hoy?</div>
        </div>
        <div style={{ marginTop: 6 }}><PrefChips prefs={prefs} onPick={onPickPref} /></div>
        <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => setStage('done')}>
          Ver recomendación
        </button>
      </div>
    );
  }

  const rec = getRecommendation(prefs);
  return (
    <div>
      <div className="chat-log">
        <div className="bubble user">{lastUserText}</div>
        <div className="bubble sofia">
          <RecommendationText product={rec.product} reasonText={rec.reasonText} /> ¿Desea que se lo agregue al carrito? <DemoTag />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={() => { onAddToCart(rec.product.id, 1); go('sofia'); }}>
          Agregar {rec.product.name} al carrito
        </button>
        <button className="btn btn-forest" onClick={() => go('challenge')}>Iniciar un desafío mientras espera</button>
        <button className="btn btn-ghost" onClick={() => go('pulso')}>Ver el Pulso de esta recomendación</button>
      </div>
    </div>
  );
}

function CallStage({ call, callActions, prefs, onPickPref, onAddToCart, go }) {
  const { onStartCall, onAnswerCall, onEndCall } = callActions;

  if (call.state === 'reposo') {
    return (
      <div className="call-stage">
        <PhoneIcon className="phone-illustration" />
        <p className="call-title">Llame a SofIA</p>
        <p className="call-sub">Una llamada de voz simulada, como en un teléfono clásico color rojo vino y café.</p>
        <button className="btn btn-primary" onClick={onStartCall}>📞 Llamar a SofIA</button>
        <p style={{ fontSize: 10.5, color: 'var(--coffee-soft)', textAlign: 'center' }}>¿Prefiere escribir? Use la pestaña Texto arriba.</p>
      </div>
    );
  }

  if (call.state === 'connecting') {
    return (
      <div className="call-stage">
        <div className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
        <p className="call-title">Conectando con usted…</p>
        <button className="btn btn-ghost" onClick={() => onEndCall('cancelado')}>Cancelar</button>
      </div>
    );
  }

  if (call.state === 'ringing') {
    return (
      <div className="call-stage">
        <PhoneIcon className="phone-illustration ring-icon" stroke="var(--coral)" />
        <p className="call-title">Llamada entrante · SofIA</p>
        <div className="call-actions">
          <div>
            <button className="call-round-btn decline" onClick={() => onEndCall('rechazada')} aria-label="Ahora no"><XIcon /></button>
            <p className="call-label">Ahora no</p>
          </div>
          <div>
            <button className="call-round-btn accept" onClick={onAnswerCall} aria-label="Contestar"><PhoneIcon /></button>
            <p className="call-label">Contestar</p>
          </div>
        </div>
      </div>
    );
  }

  if (call.state === 'active') {
    return (
      <CallActive
        call={call}
        callActions={callActions}
        prefs={prefs}
        onPickPref={onPickPref}
        onAddToCart={onAddToCart}
      />
    );
  }

  if (call.state === 'ended') {
    return <CallEnded call={call} callActions={callActions} go={go} />;
  }

  return null;
}

function CallActive({ call, callActions, prefs, onPickPref, onAddToCart }) {
  const { phase: callPhase, lastRecommendation: lastCallRecommendation } = call;
  const { onEndCall, onProceedCallAfterPrefs } = callActions;
  const stateLabel = { asking: 'Conversando', escuchando: 'Escuchando', consultando: 'Consultando', respondiendo: 'Respondiendo' }[callPhase] || 'En llamada';
  const ringColor = { escuchando: 'var(--coral)', consultando: 'var(--amber)' }[callPhase] || 'var(--emerald)';

  return (
    <div className="call-stage" style={{ justifyContent: 'flex-start', paddingTop: 4 }}>
      <div className="avatar-ring state-idle" style={{ position: 'relative', '--ring-color': ringColor }}>
        <div className="wave-rings" aria-hidden="true"><i /><i /><i /></div>
        <img className="sofia-avatar" src={avatarSrc} alt="Avatar de SofIA, anfitriona de inteligencia artificial" />
      </div>
      <div className="status-pill"><span className="status-dot" style={{ background: ringColor }} /><span>{stateLabel}</span></div>
      <div style={{ width: '100%' }}>
        {callPhase === 'asking' && (
          <>
            <p style={{ fontSize: 12.5, color: 'var(--coffee-soft)', textAlign: 'center', margin: '2px 0 10px' }}>
              SofIA pregunta: «Para recomendarle bien, ¿cómo lo prefiere hoy?»
            </p>
            <PrefChips prefs={prefs} onPick={onPickPref} />
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={onProceedCallAfterPrefs}>Continuar</button>
          </>
        )}
        {(callPhase === 'escuchando' || callPhase === 'consultando') && (
          <p className="mic-state" style={{ textAlign: 'center' }}>
            {callPhase === 'escuchando' ? '«¿Qué me recomienda para esta tarde?»' : 'Revisando el menú disponible…'}
          </p>
        )}
        {callPhase === 'respondiendo' && lastCallRecommendation && (
          <>
            <div className="chat-log">
              <div className="bubble sofia">
                <RecommendationText product={lastCallRecommendation.product} reasonText={lastCallRecommendation.reasonText} /> <DemoTag />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <button className="btn btn-primary" onClick={() => onAddToCart(lastCallRecommendation.product.id, 1)}>
                Agregar {lastCallRecommendation.product.name} al carrito
              </button>
              <button className="btn btn-forest" onClick={() => onEndCall('finalizada')}>Finalizar y ver resumen</button>
            </div>
          </>
        )}
      </div>
      <button className="call-round-btn end" onClick={() => onEndCall('finalizada')} aria-label="Finalizar llamada"><XIcon /></button>
      <p className="call-label">Finalizar llamada</p>
    </div>
  );
}

function formatDuration(callStartedAt, callEndedAt) {
  const secs = Math.max(1, Math.round(((callEndedAt || Date.now()) - (callStartedAt || Date.now())) / 1000));
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function CallEnded({ call, callActions, go }) {
  const { startedAt: callStartedAt, endedAt: callEndedAt, lastRecommendation: lastCallRecommendation } = call;
  return (
    <div className="call-stage">
      <div className="call-summary-card">
        <p className="call-sub">Llamada finalizada</p>
        <p className="dur">{formatDuration(callStartedAt, callEndedAt)}</p>
        <p style={{ fontSize: 12.5, color: 'var(--coffee-soft)', marginTop: 8 }}>
          {lastCallRecommendation ? <>SofIA le recomendó <b>{lastCallRecommendation.product.name}</b>.</> : 'La llamada terminó antes de recibir una recomendación.'}
        </p>
      </div>
      <button className="btn btn-primary" onClick={callActions.onReturnToReposo}>Volver a llamar</button>
      <button className="btn btn-ghost" onClick={() => go('pulso')}>Ver en El Pulso</button>
    </div>
  );
}
