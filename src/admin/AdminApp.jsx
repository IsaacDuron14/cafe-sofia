import { useEffect, useState } from 'react';
import { callAdmin } from './adminApi.js';
import './AdminApp.css';

/**
 * Panel de administración (Etapa 8). Vive en /admin, separado del e-commerce
 * del cliente. La contraseña se valida en el servidor (api/admin.js); acá
 * solo se guarda en memoria mientras dura la sesión del navegador (se pierde
 * al recargar, es intencional para esta demo del curso).
 */
export default function AdminApp() {
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null); // password ya validada, o null
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('cafes');

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const res = await callAdmin(password, 'admin_list');
    setLoggingIn(false);
    if (res.ok) {
      setSession(password);
      setData(res);
    } else if (res.error === 'Clave incorrecta') {
      setLoginError('Clave incorrecta.');
    } else {
      setLoginError(res.error || 'El panel no está configurado.');
    }
  }

  // Actualiza la lista cada pocos segundos mientras hay sesión activa. No es
  // "tiempo real": una consulta de más a Apps Script tarda unos segundos, así
  // que refrescar sin parar volvería todo más lento para todos.
  useEffect(() => {
    if (!session) return undefined;
    const refresh = async () => {
      const res = await callAdmin(session, 'admin_list');
      if (res.ok) setData(res);
    };
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [session]);

  async function refetch() {
    const res = await callAdmin(session, 'admin_list');
    if (res.ok) setData(res);
  }

  if (!session) {
    return (
      <div className="admin-shell admin-login-shell">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h1>Café SofIA · Panel</h1>
          <p className="admin-lede">Ingresá la clave del equipo para administrar el café.</p>
          <input
            type="password"
            className="admin-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button className="admin-btn admin-btn-primary" type="submit" disabled={loggingIn}>
            {loggingIn ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Café SofIA · Panel de administración</h1>
        <button className="admin-btn admin-btn-ghost" onClick={() => setSession(null)}>Salir</button>
      </header>

      <nav className="admin-tabs">
        <button className={tab === 'cafes' ? 'active' : ''} onClick={() => setTab('cafes')}>Cafés</button>
        <button className={tab === 'insumos' ? 'active' : ''} onClick={() => setTab('insumos')}>Insumos y stock</button>
        <button className={tab === 'transferencias' ? 'active' : ''} onClick={() => setTab('transferencias')}>
          Transferencias por confirmar
          {data && data.transferencias.length > 0 && <span className="admin-badge">{data.transferencias.length}</span>}
        </button>
      </nav>

      <main className="admin-main">
        {!data ? (
          <p>Cargando…</p>
        ) : tab === 'cafes' ? (
          <CafesTab session={session} cafes={data.cafes} onChanged={refetch} />
        ) : tab === 'insumos' ? (
          <InsumosTab session={session} insumos={data.insumos} onChanged={refetch} />
        ) : (
          <TransferenciasTab session={session} transferencias={data.transferencias} onChanged={refetch} />
        )}
      </main>
    </div>
  );
}

function CafesTab({ session, cafes, onChanged }) {
  const [editing, setEditing] = useState(null); // café en edición, o null
  const [saving, setSaving] = useState(false);

  async function guardar(item) {
    setSaving(true);
    await callAdmin(session, 'admin_upsert_item', { item });
    setSaving(false);
    setEditing(null);
    onChanged();
  }

  async function alternarActivo(cafe) {
    await callAdmin(session, 'admin_upsert_item', {
      item: { id_item: cafe.id_item, activo: String(cafe.activo) === 'true' ? 'false' : 'true' },
    });
    onChanged();
  }

  return (
    <div>
      <div className="admin-row-header">
        <h2>Cafés de la carta</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ id_item: '', nombre: '', precio: '', popularidad: 3, activo: 'true' })}>
          + Nuevo café
        </button>
      </div>

      {editing && <CafeForm initial={editing} onCancel={() => setEditing(null)} onSave={guardar} saving={saving} />}

      <table className="admin-table">
        <thead>
          <tr><th>Id</th><th>Nombre</th><th>Precio</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          {cafes.map((c) => (
            <tr key={c.id_item}>
              <td>{c.id_item}</td>
              <td>{c.nombre}</td>
              <td>₡{c.precio}</td>
              <td>{String(c.activo) === 'true' ? 'Activo' : 'Oculto'}</td>
              <td className="admin-actions">
                <button className="admin-link" onClick={() => setEditing(c)}>Editar</button>
                <button className="admin-link" onClick={() => alternarActivo(c)}>
                  {String(c.activo) === 'true' ? 'Ocultar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CafeForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  return (
    <form
      className="admin-form"
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
    >
      <label>Id (único, sin espacios) <input required disabled={!!initial.id_item && cafeYaExistia(initial)} value={form.id_item} onChange={(e) => setForm({ ...form, id_item: e.target.value })} /></label>
      <label>Nombre <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
      <label>Precio <input required type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} /></label>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button className="admin-btn admin-btn-ghost" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function cafeYaExistia(item) {
  return !!item.id_item;
}

function InsumosTab({ session, insumos, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [stockFor, setStockFor] = useState(null);
  const [saving, setSaving] = useState(false);

  async function guardar(insumo) {
    setSaving(true);
    await callAdmin(session, 'admin_upsert_insumo', { insumo });
    setSaving(false);
    setEditing(null);
    onChanged();
  }

  async function agregarStock(idInsumo, cantidad) {
    await callAdmin(session, 'admin_set_stock', { id_insumo: idInsumo, cantidad });
    setStockFor(null);
    onChanged();
  }

  return (
    <div>
      <div className="admin-row-header">
        <h2>Insumos</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ id_insumo: '', nombre: '', unidad: 'u', stock: 0, umbral_min: 10, costo_unitario: 0 })}>
          + Nuevo insumo
        </button>
      </div>

      {editing && <InsumoForm initial={editing} onCancel={() => setEditing(null)} onSave={guardar} saving={saving} />}
      {stockFor && (
        <StockForm
          insumo={stockFor}
          onCancel={() => setStockFor(null)}
          onSave={(cantidad) => agregarStock(stockFor.id, cantidad)}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr><th>Id</th><th>Nombre</th><th>Stock</th><th>Umbral</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          {insumos.map((i) => (
            <tr key={i.id} className={i.estado === 'BAJO' ? 'admin-row-alert' : ''}>
              <td>{i.id}</td>
              <td>{i.nombre}</td>
              <td>{i.stock} {i.unidad}</td>
              <td>{i.umbral_min}</td>
              <td>{i.estado === 'BAJO' ? '⚠️ Bajo' : 'OK'}</td>
              <td className="admin-actions">
                <button className="admin-link" onClick={() => setEditing({ id_insumo: i.id, nombre: i.nombre, unidad: i.unidad, stock: i.stock, umbral_min: i.umbral_min, costo_unitario: i.costo_unitario })}>Editar</button>
                <button className="admin-link" onClick={() => setStockFor(i)}>+ Agregar stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsumoForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <label>Id (único, sin espacios) <input required disabled={!!initial.id_insumo} value={form.id_insumo} onChange={(e) => setForm({ ...form, id_insumo: e.target.value })} /></label>
      <label>Nombre <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
      <label>Unidad <input value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} /></label>
      <label>Stock inicial <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></label>
      <label>Umbral mínimo <input type="number" value={form.umbral_min} onChange={(e) => setForm({ ...form, umbral_min: Number(e.target.value) })} /></label>
      <label>Costo unitario <input type="number" value={form.costo_unitario} onChange={(e) => setForm({ ...form, costo_unitario: Number(e.target.value) })} /></label>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button className="admin-btn admin-btn-ghost" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function StockForm({ insumo, onCancel, onSave }) {
  const [cantidad, setCantidad] = useState(0);
  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(cantidad); }}>
      <p>Stock actual de <b>{insumo.nombre}</b>: {insumo.stock} {insumo.unidad}</p>
      <label>Cantidad a sumar <input required type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} /></label>
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn-primary" type="submit">Confirmar</button>
        <button className="admin-btn admin-btn-ghost" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function TransferenciasTab({ session, transferencias, onChanged }) {
  async function confirmar(orderId) {
    await callAdmin(session, 'admin_confirm_transfer', { orderId });
    onChanged();
  }
  async function descartar(orderId) {
    await callAdmin(session, 'admin_discard_transfer', { orderId });
    onChanged();
  }

  if (!transferencias.length) {
    return <p className="admin-empty">No hay transferencias pendientes de confirmar por ahora.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr><th>Pedido</th><th>Monto</th><th>Fecha</th><th></th></tr>
      </thead>
      <tbody>
        {transferencias.map((t) => (
          <tr key={t.orderId}>
            <td>{t.orderId}</td>
            <td>₡{t.monto}</td>
            <td>{t.timestamp ? String(t.timestamp) : ''}</td>
            <td className="admin-actions">
              <button className="admin-link" onClick={() => confirmar(t.orderId)}>Confirmar</button>
              <button className="admin-link" onClick={() => descartar(t.orderId)}>Descartar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
