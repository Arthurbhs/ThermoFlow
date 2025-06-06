import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  googleProvider,
} from "./firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Cria o contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detecta mudanças na autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await createUserDocument(currentUser); // Garante que o documento do usuário exista
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cria documento do usuário no Firestore
  const createUserDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { displayName, email } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName || "Usuário",
          email,
          createdAt,
        });
        console.log("Documento do usuário criado no Firestore");
      } catch (error) {
        console.error("Erro ao criar documento do usuário:", error);
      }
    }
  };

  // Login com email e senha
  const login = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserDocument(user); // Cria o documento se não existir
    return userCredential;
  };

  // Registro com email, senha e nome
  const register = async (email, password, name) => {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });
    await createUserDocument({ ...user, displayName: name });

    return userCredential;
  };

  // Login com Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await createUserDocument(user);
    return result;
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Valor disponibilizado no contexto
  const value = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
