import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // MongoDB user doc (has role)
  const [profileMissing, setProfileMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const { data } = await api.get('/users/me');
          setProfile(data);
          setProfileMissing(false);
        } catch (err) {
          setProfile(null);
          // A 404 specifically means "signed in, but never finished signup" —
          // recoverable by sending them to /complete-profile. Any other error
          // (server down) must NOT push an existing user into a signup flow.
          setProfileMissing(err.response?.status === 404);
        }
      } else {
        setProfile(null);
        setProfileMissing(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register({ name, email, password, role, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Force-refresh token isn't needed here; api.js fetches a fresh one per request.
    const { data } = await api.post('/users/sync', { name, role, phone });
    setProfile(data);
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const { data } = await api.get('/users/me');
    setProfile(data);
    return cred.user;
  }

  // Google sign-in doesn't collect a role, so we can't call /users/sync blind
  // the way register() does. Instead: sign in, then check whether a Mongo
  // profile already exists. If not, tell the caller so it can route to a
  // one-time role-selection step before we ever call sync.
  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    try {
      const { data } = await api.get('/users/me');
      setProfile(data);
      return { user: cred.user, isNewUser: false };
    } catch (err) {
      if (err.response?.status === 404) {
        return { user: cred.user, isNewUser: true };
      }
      // Any other failure (server down, 500) would leave the user signed into
      // Firebase but with no app profile — a half-authenticated state that
      // PrivateRoute would still let through. Undo the sign-in so a retry
      // starts clean instead.
      await signOut(auth);
      throw err;
    }
  }

  // Finishes the Google sign-up flow once the user has picked a role —
  // same /users/sync endpoint the email/password register() flow uses.
  async function completeGoogleProfile({ name, role, phone }) {
    const { data } = await api.post('/users/sync', { name, role, phone });
    setProfile(data);
    setProfileMissing(false);
    return data;
  }

  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  // Re-pulls the Mongo profile after something changes it server-side
  // (e.g. a premium upgrade), so the UI doesn't keep showing stale state.
  async function refreshProfile() {
    const { data } = await api.get('/users/me');
    setProfile(data);
    return data;
  }

  const value = {
    firebaseUser,
    profile,
    profileMissing,
    loading,
    register,
    login,
    loginWithGoogle,
    completeGoogleProfile,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
