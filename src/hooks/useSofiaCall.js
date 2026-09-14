import { useEffect, useRef, useState } from 'react';
import { getRecommendation } from '../recommend.js';

/**
 * Todo el estado y los pasos de la conversación con SofIA: modo (voz/texto),
 * chat de texto y la máquina de estados de la llamada simulada
 * (reposo → connecting → ringing → active → ended). Agrupado en un hook
 * propio porque estos estados siempre cambian juntos y no le sirven al
 * resto de App.jsx.
 */
export function useSofiaCall(prefs, pushPulso) {
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
      pushPulso({
        detecto: 'Llamada a SofIA iniciada',
        decidio: 'Conectar al cliente con la anfitriona de voz',
        actuo: reason === 'cancelado' ? 'El cliente canceló antes de conectar' : 'El cliente no contestó la llamada',
        registro: 'Llamada finalizada sin conversación — DEMO',
      });
      setCallState('reposo');
      return;
    }
    const endedAt = Date.now();
    setCallEndedAt(endedAt);
    setCallState('ended');
    const secs = Math.max(1, Math.round((endedAt - (callStartedAt || endedAt)) / 1000));
    const m = Math.floor(secs / 60);
    const s = String(secs % 60).padStart(2, '0');
    pushPulso({
      detecto: 'Llamada con SofIA finalizada',
      decidio: 'Cerrar la sesión de voz y resumir lo conversado',
      actuo: `Duración ${m}:${s}`,
      registro: 'Llamada finalizada — DEMO',
    });
  }

  function proceedCallAfterPrefs() {
    setCallPhase('escuchando');
    callTimerRef.current = setTimeout(() => {
      setCallPhase('consultando');
      callTimerRef.current = setTimeout(() => {
        setCallPhase('respondiendo');
        const rec = getRecommendation(prefs);
        setLastCallRecommendation(rec);
        pushPulso({
          detecto: 'Consulta por voz recibida',
          decidio: 'Recomendar una bebida disponible según sus preferencias y el momento del día',
          actuo: `Sugirió ${rec.product.name} durante la llamada`,
          registro: 'Recomendación entregada por voz — DEMO',
        });
      }, 1300);
    }, 1300);
  }

  function returnToReposo() {
    setCallState('reposo');
  }

  return {
    sofiaMode, setMode,
    chatStarted, lastUserText, sendText,
    lastCallRecommendation,
    call: { state: callState, phase: callPhase, startedAt: callStartedAt, endedAt: callEndedAt, lastRecommendation: lastCallRecommendation },
    callActions: { onStartCall: startCall, onAnswerCall: answerCall, onEndCall: endCall, onProceedCallAfterPrefs: proceedCallAfterPrefs, onReturnToReposo: returnToReposo },
  };
}
