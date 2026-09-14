import { useState } from 'react';
import { PRODUCTS, PAY_METHODS, SERVICE_TAX_RATE } from './data.js';
import { cartTotal, cartItemCount } from './recommend.js';
import { resetStored } from './storage.js';
import { usePersistedState, usePersistToStorage } from './hooks/usePersistedState.js';
import { usePulsoLog } from './hooks/usePulsoLog.js';
import { useSofiaCall } from './hooks/useSofiaCall.js';

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

// Avisa al backend real (Apps Script, vía la función serverless de Vercel)
// que se confirmó una compra, para que descuente stock y anote la venta.
// No bloquea ni afecta la demo: si el backend no responde, el pedido ya
// quedó confirmado igual en pantalla.
function notifyBackendOfOrder(order) {
  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).catch(() => {});
}

export default function App() {
  const {
    initialOnboardingDone, initialPulsoLog,
    cart, setCart,
    prefs, setPrefs,
    challengeProgress, setChallengeProgress,
    orderHistory, setOrderHistory,
    onboardingDone, setOnboardingDone,
    micPermission, setMicPermission,
  } = usePersistedState();
  const { pulsoLog, pushPulso } = usePulsoLog(initialPulsoLog);
  usePersistToStorage({ cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission });

  const [view, setView] = useState(initialOnboardingDone ? 'home' : 'qr');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);

  const {
    sofiaMode, setMode, chatStarted, lastUserText, sendText,
    lastCallRecommendation, call, callActions,
  } = useSofiaCall(prefs, pushPulso);

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
    pushPulso({
      detecto: `Producto agregado: ${p.name}`,
      decidio: 'Sumarlo a su carrito con la cantidad indicada',
      actuo: `Agregó ${qty} unidad(es) de ${p.name}`,
      registro: 'Carrito actualizado — DEMO',
    });
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
        pushPulso({
          detecto: 'Intento de pago simulado',
          decidio: 'Detener el proceso si el pago no se aprueba',
          actuo: 'Rechazó la transacción de prueba',
          registro: 'Pago fallido — el carrito se conserva intacto',
        });
        window.alert('El pago no pudo procesarse (simulado). Su carrito sigue intacto — puede intentar de nuevo.');
        setView('confirm');
        return;
      }
      const orderNo = 'SOFIA-' + Math.floor(1000 + Math.random() * 9000);
      const count = cartItemCount(cart);
      const methodLabel = (PAY_METHODS.find((m) => m.id === selectedPayId) || {}).label || '—';
      const total = cartTotal(cart, SERVICE_TAX_RATE);
      const order = { orderNo, items: { ...cart }, total, method: selectedPayId };
      notifyBackendOfOrder(order);
      setLastOrder(order);
      setOrderHistory((h) => [
        ...h,
        { orderNo, total, count, methodLabel, when: new Date().toLocaleString('es-CR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) },
      ]);
      pushPulso({
        detecto: 'Pago aprobado (simulado)',
        decidio: 'Registrar la venta y liberar la reserva',
        actuo: `Generó el comprobante ${orderNo}`,
        registro: 'Pedido registrado — DEMO',
      });
      setCart({});
      setView('receipt');
    }, 1200);
  }

  function confirmPickup() {
    pushPulso({
      detecto: 'Cliente confirmó el retiro del pedido',
      decidio: 'Cerrar el ciclo del pedido y marcarlo como entregado',
      actuo: `Marcó ${lastOrder ? lastOrder.orderNo : 'el pedido'} como retirado`,
      registro: 'Pedido retirado — DEMO',
    });
    setView('pickup-confirm');
  }

  function pickPref(key, val) {
    setPrefs((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));
  }

  function handleMicPermission(v) {
    setMicPermission(v);
    setOnboardingDone(true);
    if (!v) setMode('texto');
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
    pushPulso({
      detecto: `Respuesta del desafío "${c.eyebrow}" recibida`,
      decidio: 'Validar la respuesta y explicar el porqué',
      actuo: 'Marcó el desafío como completado',
      registro: 'Correcto — aprendizaje mostrado',
    });
  }

  const cartCount = cartItemCount(cart);
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
      {view === 'mic-permission' && <MicPermissionView onSetMicPermission={handleMicPermission} />}

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
          call={call}
          callActions={callActions}
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
