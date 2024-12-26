import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FormData } from '../types';

const RECEIPTS_COLLECTION = 'receipts';

export const receiptsService = {
  subscribeToReceipts: (onUpdate: (receipts: FormData[]) => void) => {
    const receiptsRef = collection(db, RECEIPTS_COLLECTION);
    const q = query(receiptsRef);
    
    return onSnapshot(q, (snapshot) => {
      const receipts: FormData[] = [];
      snapshot.forEach((doc) => {
        receipts.push({ ...doc.data(), id: doc.id } as FormData);
      });
      onUpdate(receipts);
    });
  },

  addReceipt: async (receipt: Omit<FormData, 'id'>) => {
    const receiptsRef = collection(db, RECEIPTS_COLLECTION);
    return addDoc(receiptsRef, receipt);
  },

  updateReceipt: async (id: string, receipt: Partial<FormData>) => {
    const docRef = doc(db, RECEIPTS_COLLECTION, id);
    return updateDoc(docRef, receipt);
  },

  deleteReceipt: async (id: string) => {
    return deleteDoc(doc(db, RECEIPTS_COLLECTION, id));
  }
};