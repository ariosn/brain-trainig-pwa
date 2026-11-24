import { db } from './db'; // Ajusta a './db' si lo guardas directo en src/

const PIN_STORAGE_KEY = 'brain_training_admin_pin';
const DEFAULT_PIN = '1234'; // PIN inicial para la terapeuta Bárbara

// --- 1. GESTIÓN DE AUTENTICACIÓN LOCAL (PIN) ---
export function getStoredPin() {
  return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
}

export function verifyPin(inputPin) {
  return inputPin === getStoredPin();
}

export function updatePin(newPin) {
  if (!/^\d{4}$/.test(newPin)) {
    throw new Error('El PIN debe tener exactamente 4 dígitos numéricos.');
  }
  localStorage.setItem(PIN_STORAGE_KEY, newPin);
}

// --- 2. EXPORTACIÓN E IMPORTACIÓN DE RESPALDOS (JSON) ---
export async function exportDatabaseBackup() {
  const patients = await db.patients.toArray();
  const sessions = await db.sessions.toArray();

  const backupData = {
    appName: 'BrainTrainingPWA',
    exportDate: new Date().toISOString(),
    version: 1,
    data: {
      patients,
      sessions,
    },
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `respaldo_pacientes_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importDatabaseBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!parsed.data || !Array.isArray(parsed.data.patients) || !Array.isArray(parsed.data.sessions)) {
          throw new Error('El archivo no tiene un formato de respaldo válido.');
        }

        await db.transaction('rw', db.patients, db.sessions, async () => {
          await db.patients.bulkPut(parsed.data.patients);
          await db.sessions.bulkPut(parsed.data.sessions);
        });

        resolve({
          patientsCount: parsed.data.patients.length,
          sessionsCount: parsed.data.sessions.length,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo seleccionado.'));
    reader.readAsText(file);
  });
}