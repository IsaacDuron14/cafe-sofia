export default function Paying() {
  return (
    <div className="view active" data-group="menu">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div className="spinner" style={{ width: 34, height: 34, borderWidth: 3 }} />
        <p style={{ fontSize: 13, color: 'var(--coffee-soft)' }}>Procesando pago simulado…</p>
      </div>
    </div>
  );
}
