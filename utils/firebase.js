import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../google-services.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth();
