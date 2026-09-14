import { useEffect, useMemo, useState } from 'react';
import { loadStored, saveStored } from '../storage.js';

/**
 * Estado de la demo que se persiste en localStorage (carrito, preferencias,
 * progreso de desafíos, pulso, historial, onboarding y permiso de micrófono).
 * Aislar esta lectura/escritura acá deja un solo lugar para reemplazar por
 * un backend real más adelante, sin tocar la lógica de navegación en App.jsx.
 */
export function usePersistedState() {
  const stored = useMemo(loadStored, []);

  const [cart, setCart] = useState(stored.cart || {});
  const [prefs, setPrefs] = useState({ temp: null, milk: null, intensity: null, sweet: null, name: '', ...(stored.prefs || {}) });
  const [challengeProgress, setChallengeProgress] = useState(
    Array.isArray(stored.challengeProgress) && stored.challengeProgress.length === 5 ? stored.challengeProgress : [false, false, false, false, false]
  );
  const [orderHistory, setOrderHistory] = useState(Array.isArray(stored.orderHistory) ? stored.orderHistory : []);
  const [onboardingDone, setOnboardingDone] = useState(!!stored.onboardingDone);
  const [micPermission, setMicPermission] = useState(typeof stored.micPermission === 'boolean' ? stored.micPermission : null);

  return {
    initialOnboardingDone: stored.onboardingDone,
    initialPulsoLog: stored.pulsoLog,
    cart, setCart,
    prefs, setPrefs,
    challengeProgress, setChallengeProgress,
    orderHistory, setOrderHistory,
    onboardingDone, setOnboardingDone,
    micPermission, setMicPermission,
  };
}

export function usePersistToStorage({ cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission }) {
  useEffect(() => {
    saveStored({ cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission });
  }, [cart, prefs, challengeProgress, pulsoLog, orderHistory, onboardingDone, micPermission]);
}
