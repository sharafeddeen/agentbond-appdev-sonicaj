import { initializeApp, getApp, getApps } from 'firebase/app';
import firebaseConfig from './firebase-config'; // Your Firebase config

// Initialize Firebase only if there are no initialized apps
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;