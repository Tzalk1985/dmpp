import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}