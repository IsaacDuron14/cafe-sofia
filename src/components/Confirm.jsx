import { useEffect, useRef, useState } from 'react';
import { PAY_METHODS, SERVICE_TAX_RATE, money } from '../data.js';
import { cartTotal } from '../recommend.js';
import { ClockIcon } from './Icons.jsx';

/**
 * Confirmar y pagar. Reserva temporal de 5 minutos (299s) con verificación
 * de stock si expira, igual que el prototipo aprobado.
 */
export default function Confirm({ cart, go, onPay, pushPulso }) {
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  const [reserveSecs, setReserveSecs] = useState(299);
  const [reserveExpired, setReserveExpired] = useState(false);
  const [rechecking, setRechecking] = useState(false);
  const [selectedPay, setSelectedPay] = useState(PAY_METHODS[0].id);
  const [simulateFail, setSimulateFail] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!ids.length) { go('cart'); return; }
    if (!pushedRef.current) {
      pushedRef.current = true;
      pushPulso({
        detecto: 'Pedido confirmado por el cliente',
        decidio: 'Reservar temporalmente el stock antes del pago',
        actuo: 'Bloqueó las unidades del carrito por 5 minutos',
        registro: 'Reserva activa — DEMO',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reserveExpired || rechecking || !ids.length) return undefined;
    const handle = setInterval(() => {
      setReserveSecs((s) => {
        if (s <= 1) {
          clearInterval(handle);
          setReserveExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserveExpired, rechecking]);

  if (!ids.length) return null;

  function recheckStock() {
    setRechecking(true);
    setTimeout(() => {
      setReserveExpired(false);
      setReserveSecs(299);
      setRechecking(false);
      pushPulso({
        detecto: 'Nueva verificación de stock solicitada',
        decidio: 'Confirmar que las unidades reservadas siguen disponibles',
        actuo: 'Repitió la validación de inventario',
        registro: 'Stock confirmado — reserva reiniciada',
      });
    }, 900);
  }

  const m = Math.floor(reserveSecs / 60);
  const s = String(reserveSecs % 60).padStart(2, '0');

  return (
    <div className="view active" data-group="menu">
      <h1 className="page-title">Confirmar y pagar</h1>
      <div className="reserve-chip">
        <ClockIcon width="15" height="15" />
        Reserva temporal · expira en <b>{m}:{s}</b>
        <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, border: '1px solid rgba(239,170,52,.5)', padding: '2px 6px', borderRadius: 999 }}>DEMO</span>
      </div>

      <p className="section-label">Método de pago</p>
      <div>
        {PAY_METHODS.map((pm) => (
          <div
            key={pm.id}
            className={`pay-option ${pm.id === selectedPay ? 'selected' : ''}`}
            style={{ opacity: reserveExpired ? 0.5 : 1 }}
            onClick={() => setSelectedPay(pm.id)}
          >
            <span className="dot" />{pm.label}
          </div>
        ))}
      </div>

      <label className="demo-check">
        <input type="checkbox" checked={simulateFail} onChange={(e) => setSimulateFail(e.target.checked)} /> Simular pago fallido (para probar el recorrido)
      </label>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rechecking ? (
          <div className="stock-row"><div className="spinner" /><span>Comprobando disponibilidad…</span></div>
        ) : reserveExpired ? (
          <>
            <span className="pending-note">Su reserva de stock expiró. Verifique disponibilidad para continuar.</span>
            <button className="btn btn-primary" onClick={recheckStock}>Comprobar stock nuevamente</button>
            <button className="btn btn-ghost" onClick={() => go('cart')}>Volver al carrito</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => onPay(selectedPay, simulateFail)}>Pagar {money(cartTotal(cart, SERVICE_TAX_RATE))}</button>
            <button className="btn btn-ghost" onClick={() => go('cart')}>Volver al carrito</button>
          </>
        )}
      </div>
    </div>
  );
}
