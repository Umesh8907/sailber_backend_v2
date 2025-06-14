import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const filePath = path.resolve(__dirname, '../firebase-service-account.json');
  const jsonData = readFileSync(filePath, 'utf-8');
  serviceAccount = JSON.parse(jsonData);
}

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();
