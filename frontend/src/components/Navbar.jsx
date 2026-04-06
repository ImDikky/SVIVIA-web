import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar-minimal">
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
        SVIVA.
      </div>
      <button className="btn-minimal" style={{ border: 'none', fontSize: '0.75rem' }}>Descargar</button>
    </header>
  );
}
