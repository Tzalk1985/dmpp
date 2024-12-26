import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserData } from '../types';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // If user document doesn't exist, create it with basic info
            const basicUserData: UserData = {
              id: user.uid,
              email: user.email || '',
              name: user.displayName || '',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, basicUserData);
            setUserData(basicUserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error('Error loading user data');
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserData = {
        id: userCredential.user.uid,
        email,
        name,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUserData(userData);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Email already in use. Please try logging in.');
        } else {
          toast.error('Failed to create account. Please try again.');
        }
      }
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          toast.error('Invalid email or password.');
        } else {
          toast.error('Failed to log in. Please try again.');
        }
      }
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('Failed to log out. Please try again.');
      throw error;
    }
  }

  const value = {
    user,
    userData,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}