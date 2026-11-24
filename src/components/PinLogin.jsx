import React, { useState } from 'react';
import { verifyPin } from '../backupAndAuth';

export default function PinLogin({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      setError('');
      onUnlock();
    } else {
      setError('PIN incorrecto. Intente nuevamente.');
      setPin('');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Acceso Terapeuta</h2>
        <p style={styles.subtitle}>
          Ingrese su PIN de 4 dígitos para acceder a las fichas clínicas y actividades.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            style={styles.input}
            autoFocus
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Ingresar al Sistema
          </button>
        </form>

        <small style={styles.hint}>PIN inicial por defecto: 1234</small>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1e293b' },
  subtitle: { fontSize: '1rem', color: '#475569', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    fontSize: '2rem',
    textAlign: 'center',
    letterSpacing: '0.75rem',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '2px solid #cbd5e1',
  },
  button: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '0.9rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  error: { color: '#dc2626', fontWeight: 'bold', margin: 0 },
  hint: { display: 'block', marginTop: '1.2rem', color: '#64748b' },
};