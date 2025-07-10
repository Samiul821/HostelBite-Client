import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../../Firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (userData) => {
    return updateProfile(auth.currentUser, userData);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const passwordReset = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  //   Google Sign In
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Facebook Sign In
  const facebookSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    updateUser,
    signIn,
    passwordReset,
    googleSignIn,
    facebookSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
