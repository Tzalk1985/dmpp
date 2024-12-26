import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserData } from '../types';

const USERS_COLLECTION = 'users';

export const usersService = {
  createUser: async (userData: UserData) => {
    return setDoc(doc(db, USERS_COLLECTION, userData.id), userData);
  },

  getUser: async (userId: string) => {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  },

  updateUser: async (userId: string, userData: Partial<UserData>) => {
    const userRef = doc(db, USERS_COLLECTION, userId);
    return setDoc(userRef, userData, { merge: true });
  }
};