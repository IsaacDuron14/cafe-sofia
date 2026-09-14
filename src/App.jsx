import { useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS, PAY_METHODS, SERVICE_TAX_RATE } from './data.js';
import { cartTotal, getRecommendation } from './recommend.js';
import { loadStored, saveStored, resetStored } from './storage.js';

import { CartIcon } from './components/Icons.jsx';
import Navbar from './components/Navbar.jsx';
import { QrView, WelcomeView, GuestView, PrivacyView, AiInfoView, MicPermissionView } from './components/Onboarding.jsx';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import Detail from './components/Detail.jsx';
import Cart from './components/Cart.jsx';
import Confirm from './components/Confirm.jsx';
import Paying from './components/Paying.jsx';
import Receipt from './components/Receipt.jsx';
import Status from './components/Status.jsx';
import PickupConfirm from './components/PickupConfirm.jsx';
import Survey from './components/Survey.jsx';
import Sofia from './components/Sofia.jsx';
import Challenge from './components/Challenge.jsx';
import Pulso from './components/Pulso.jsx';
import Perfil from './components/Perfil.jsx';
import Historial from './components/Historial.jsx';
import ChallengesProgress from './components/ChallengesProgress.jsx';

const ONBOARD_VIEWS = ['qr', 'welcome', 'guest', 'privacy', 'ai-info', 'mic-permission'];
const VIEW_GROUPS = {
  qr: 'onboarding', welcome: 'onboarding', guest: 'onboarding', privacy: 'onboarding', 'ai-info': 'onboarding', 'mic-permission': 'onboarding',
  home: 'inicio',
  menu: 'menu', detail: 'menu', cart: 'menu', confirm: 'menu', paying: 'menu', receipt: 'menu', status: 'menu', 'pickup-confirm': 'menu', survey: 'menu',
  sofia: 'sofia', challenge: 'sofia',
  pulso: 'pulso',
  perfil: 'perfil', historial: 'perfil', 'challenges-progress': 'perfil',
};

export default function App() {
  const stored = useMemo(loadStored, []);

  const [cart, setCart] = useState(stored.cart || {});
  const [prefs, setPrefs] = useState({ temp: null, milk: null, intensity: null, sweet: null, name: '', ...(stored.prefs || {}) });
  const [challengeProgress, setChallengeProgress] = useState(
    Array.isArray(stored.challengeProgress) && stored.challengeProgress.length === 5 ? stored.challengeProgress : [false, false, false, false, false]
  );
  const [pulsoLog, setPulsoLog] = useState(Array.isArray(stored.pulsoLog) ? stored.pulsoLog : []);
  const [orderHistory, setOrderHistory] = useState(Array.isArray(stored.orderHistory) ? stored.orderHistory : []);
  const [onboardingDone, setOnboardingDone] = useState(!!stored.onboardingDone);
  const [micPermission, setMicPermissionState] = useState(typeof stored.micPermission === 'boolean' ? stored.micPermission : null);

  const [view, setView] = useState(stored.onboardingDone ? 'home' : 'qr');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);

  const [sofiaMode, setSofiaModeState] = useState('voz');
  const [chatStarted, setChatStarted] = useState(false);
  const [lastUserText, setLastUserText] = useState('¿Qué me recomienda para esta tarde?');

  const [callState, setCallState] = useState('reposo');
  const [callPhase, setCallPhase] = useState('asking');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [callEndedAt, setCallEndedAt] = useState(null);
  const [lastCallRecommendation, setLastCallRecommendation] = useState(null);
  const callTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(callTimerRef.current), []);

  // Persistencia simulada: se guarda en localStorage cada vez que cambian estos datos.
  useEffect(() => {
    saveStored({ cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission });
  }, [cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission]);

  function pushPulso(detecto, decidio, actuo, registro) {
    const t = new Date();
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    setPulsoLog((prev) => [{ time: `${hh}:${mm}`, detecto, decidio, actuo, registro }, ...prev]);
  }

  function go(v) {
    setView(v);
  }

  function openDetail(id) {
    setCurrentProductId(id);
    setView('detail');
  }

  function addToCart(id, qty) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || !p.available) return;
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }));
    pushPulso(
      `Producto agregado: ${p.name}`,
      'Sumarlo a su carrito con la cantidad indicada',
      `Agregó ${qty} unidad(es) de ${p.name}`,
      'Carrito actualizado — DEMO'
    );
    setView('menu');
  }

  function changeCartQty(id, d) {
    setCart((prev) => {
      const next = { ...prev };
      next[id] = Math.max(0, (next[id] || 0) + d);
      if (next[id] === 0) delete next[id];
      return next;
    });
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function pay(selectedPayId, simulateFail) {
    setView('paying');
    setTimeout(() => {
      if (simulateFail) {
        pushPulso(
          'Intento de pago simulado',
          'Detener el proceso si el pago no se aprueba',
          'Rechazó la transacción de prueba',
          'Pago fallido — el carrito se conserva intacto'
        );
        window.alert('El pago no pudo procesarse (simulado). Su carrito sigue intacto — puede intentar de nuevo.');
        setView('confirm');
        return;
      }
      const orderNo = 'SOFIA-' + Math.floor(1000 + Math.random() * 9000);
      const count = Object.values(cart).reduce((a, b) => a + b, 0);
      const methodLabel = (PAY_METHODS.find((m) => m.id === selectedPayId) || {}).label || '—';
      const total = cartTotal(cart, SERVICE_TAX_RATE);
      const order = { orderNo, items: { ...cart }, total, method: selectedPayId };
      setLastOrder(order);
      setOrderHistory((h) => [
        ...h,
        { orderNo, total, count, methodLabel, when: new Date().toLocaleString('es-CR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) },
      ]);
      pushPulso('Pago aprobado (simulado)', 'Registrar la venta y liberar la reserva', `Generó el comprobante ${orderNo}`, 'Pedido registrado — DEMO');
      setCart({});
      setView('receipt');
    }, 1200);
  }

  function confirmPickup() {
    pushPulso(
      'Cliente confirmó el retiro del pedido',
      'Cerrar el ciclo del pedido y marcarlo como entregado',
      `Marcó ${lastOrder ? lastOrder.orderNo : 'el pedido'} como retirado`,
      'Pedido retirado — DEMO'
    );
    setView('pickup-confirm');
  }

  function pickPref(key, val) {
    setPrefs((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));
  }

  function setMicPermission(v) {
    setMicPermissionState(v);
    setOnboardingDone(true);
    if (!v) setSofiaModeState('texto');
    setView('home');
  }

  function saveProfileName(name) {
    setPrefs((prev) => ({ ...prev, name }));
    window.alert('Preferencias guardadas para esta demostración.');
  }

  function confirmReset() {
    if (window.confirm('¿Reiniciar todos los datos de esta demostración? Esta acción no se puede deshacer.')) resetStored();
  }

  function openChallenge(i) {
    setCurrentChallenge(i);
    setView('challenge');
  }

  function onChallengeCorrect(c) {
    setChallengeProgress((prev) => {
      const next = [...prev];
      next[currentChallenge] = true;
      return next;
    });
    pushPulso(
      `Respuesta del desafío "${c.eyebrow}" recibida`,
      'Validar la respuesta y explicar el porqué',
      'Marcó el desafío como completado',
      'Correcto — aprendizaje mostrado'
    );
  }

  function setMode(m) {
    setSofiaModeState(m);
    if (m === 'voz') setCallState('reposo');
  }

  function sendText(text) {
    setLastUserText(text);
    setChatStarted(true);
  }

  function startCall() {
    clearTimeout(callTimerRef.current);
    setCallState('connecting');
    callTimerRef.current = setTimeout(() => setCallState('ringing'), 1400);
  }

  function answerCall() {
    setCallState('active');
    setCallPhase('asking');
    setCallStartedAt(Date.now());
  }

  function endCall(reason) {
    clearTimeout(callTimerRef.current);
    if (reason === 'cancelado' || reason === 'rechazada') {
      pushPulso(
        'Llamada a SofIA iniciada',
        'Conectar al cliente con la anfitriona de voz',
        reason === 'cancelado' ? 'El cliente canceló antes de conectar' : 'El cliente no contestó la llamada',
        'Llamada finalizada sin conversación — DEMO'
      );
      setCallState('reposo');
      return;
    }
    const endedAt = Date.now();
    setCallEndedAt(endedAt);
    setCallState('ended');
    const secs = Math.max(1, Math.round((endedAt - (callStartedAt || endedAt)) / 1000));
    const m = Math.floor(secs / 60);
    const s = String(secs % 60).padStart(2, '0');
    pushPulso('Llamada con SofIA finalizada', 'Cerrar la sesión de voz y resumir lo conversado', `Duración ${m}:${s}`, 'Llamada finalizada — DEMO');
  }

  function proceedCallAfterPrefs() {
    setCallPhase('escuchando');
    callTimerRef.current = setTimeout(() => {
      setCallPhase('consultando');
      callTimerRef.current = setTimeout(() => {
        setCallPhase('respondiendo');
        const rec = getRecommendation(prefs);
        setLastCallRecommendation(rec);
        pushPulso(
          'Consulta por voz recibida',
          'Recomendar una bebida disponible según sus preferencias y el momento del día',
          `Sugirió ${rec.product.name} durante la llamada`,
          'Recomendación entregada por voz — DEMO'
        );
      }, 1300);
    }, 1300);
  }

  function returnToReposo() {
    setCallState('reposo');
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const isOnboarding = ONBOARD_VIEWS.includes(view);
  const activeGroup = VIEW_GROUPS[view];

  return (
    <div className={`app-shell${isOnboarding ? ' onboarding' : ''}`}>
      <div className="appbar">
        <div className="brand">Café Sof<span className="ia">IA</span></div>
        <button className="cart-btn" onClick={() => go('cart')} aria-label="Ver carrito">
          <CartIcon />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {view === 'qr' && <QrView go={go} />}
      {view === 'welcome' && <WelcomeView go={go} />}
      {view === 'guest' && <GuestView go={go} />}
      {view === 'privacy' && <PrivacyView go={go} />}
      {view === 'ai-info' && <AiInfoView go={go} />}
      {view === 'mic-permission' && <MicPermissionView onSetMicPermission={setMicPermission} />}

      {view === 'home' && <Home go={go} onOpenDetail={openDetail} onAdd={addToCart} lastCallRecommendation={lastCallRecommendation} />}
      {view === 'menu' && (
        <Menu onOpenDetail={openDetail} onAdd={addToCart} lastCallRecommendation={lastCallRecommendation} activeFilter={activeFilter} onSetFilter={setActiveFilter} />
      )}
      {view === 'detail' && <Detail key={currentProductId} productId={currentProductId} go={go} onAdd={addToCart} pushPulso={pushPulso} />}
      {view === 'cart' && <Cart cart={cart} go={go} onChangeQty={changeCartQty} onRemove={removeFromCart} />}
      {view === 'confirm' && <Confirm cart={cart} go={go} onPay={pay} pushPulso={pushPulso} />}
      {view === 'paying' && <Paying />}
      {view === 'receipt' && <Receipt lastOrder={lastOrder} go={go} />}
      {view === 'status' && <Status lastOrder={lastOrder} go={go} pushPulso={pushPulso} onConfirmPickup={confirmPickup} />}
      {view === 'pickup-confirm' && <PickupConfirm go={go} />}
      {view === 'survey' && <Survey go={go} pushPulso={pushPulso} />}

      {view === 'sofia' && (
        <Sofia
          sofiaMode={sofiaMode}
          onSetMode={setMode}
          chatStarted={chatStarted}
          lastUserText={lastUserText}
          onSendText={sendText}
          prefs={prefs}
          onPickPref={pickPref}
          onAddToCart={addToCart}
          go={go}
          pushPulso={pushPulso}
          callState={callState}
          callPhase={callPhase}
          callStartedAt={callStartedAt}
          callEndedAt={callEndedAt}
          lastCallRecommendation={lastCallRecommendation}
          onStartCall={startCall}
          onAnswerCall={answerCall}
          onEndCall={endCall}
          onProceedCallAfterPrefs={proceedCallAfterPrefs}
          onReturnToReposo={returnToReposo}
        />
      )}
      {view === 'challenge' && (
        <Challenge
          key={currentChallenge}
          currentChallenge={currentChallenge}
          challengeProgress={challengeProgress}
          onAnswerCorrect={onChallengeCorrect}
          onOpenChallenge={openChallenge}
          go={go}
        />
      )}

      {view === 'pulso' && <Pulso pulsoLog={pulsoLog} />}

      {view === 'perfil' && <Perfil prefs={prefs} onPickPref={pickPref} onSaveName={saveProfileName} go={go} onConfirmReset={confirmReset} />}
      {view === 'historial' && <Historial orderHistory={orderHistory} go={go} />}
      {view === 'challenges-progress' && <ChallengesProgress challengeProgress={challengeProgress} onOpenChallenge={openChallenge} go={go} />}

      <Navbar activeGroup={activeGroup} go={go} />
    </div>
  );
}
