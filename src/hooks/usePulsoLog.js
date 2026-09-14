import { useState } from 'react';

/**
 * "El Pulso de SofIA": bitácora de transparencia (qué detectó, decidió,
 * actuó y registró SofIA en cada acción). `pushPulso` recibe un objeto
 * en vez de argumentos posicionales para que cada llamado sea autoexplicativo.
 */
export function usePulsoLog(initialLog) {
  const [pulsoLog, setPulsoLog] = useState(Array.isArray(initialLog) ? initialLog : []);

  function pushPulso({ detecto, decidio, actuo, registro }) {
    const t = new Date();
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    setPulsoLog((prev) => [{ time: `${hh}:${mm}`, detecto, decidio, actuo, registro }, ...prev]);
  }

  return { pulsoLog, pushPulso };
}
