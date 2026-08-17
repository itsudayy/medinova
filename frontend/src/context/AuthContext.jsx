import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from '../services/api';

const AuthContext = createContext(null);

// Google gives us an identity but no application role. Everyone who signs in
// with Google is a patient — doctors are onboarded through the regular signup
// form (which asks for a role) and then approved by an admin, so there is no
// case where a Google sign-in should silently create a doctor account.
const GOOGLE_DEFAULT_ROLE = 'patient';

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // MongoDB user doc (has role)
  const [loading, setLoading] = useState(true);

  // Syncs a Google identity into Mongo. syncUser is create-or-return, so an
  // existing user keeps their stored role/status and no duplicate is made —
  // the role below only applies the very first time.
  async function syncGoogleUser(user) {
    const { data } = await api.post('/users/sync', {
      name: user.displayName || user.email?.split('@')[0] || 'MediNova user',
      role: GOOGLE_DEFAULT_ROLE,
    });
    setProfile(data);
    return data;
  }

  useEffect(() => {
    // If a popup was blocked we fall back to a full-page redirect, so on load
    // we have to check whether we're coming back from one.
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) return syncGoogleUser(result.user);
      })
      .catch(() => {
        /* no pending redirect, or it failed — onAuthStateChanged still runs */
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const { data } = await api.get('/users/me');
          setProfile(data);
        } catch (err) {
          // A 404 means the Firebase identity exists but was never synced to
          // Mongo (e.g. a Google sign-in that got interrupted). Self-heal by
          // syncing now instead of stranding the user in a broken session.
          if (err.response?.status === 404) {
            try {
              await syncGoogleUser(user);
            } catch {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
        }
      } else {
        setProfile(null);
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

  // One call handles both new and returning Google users: sign in, then sync.
  // The backend decides whether that's a create or a fetch, which is what keeps
  // this from ever producing a duplicate account.
  async function loginWithGoogle() {
    let cred;
    try {
      cred = await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // Popups are blocked by default in some browsers and in embedded
      // webviews. Redirecting is the supported fallback — the result is picked
      // up by getRedirectResult() when the app reloads.
      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return { redirecting: true };
      }
      throw err;
    }

    try {
      await syncGoogleUser(cred.user);
      return { user: cred.user };
    } catch (err) {
      // Signed into Firebase but the profile never synced (server down, etc).
      // Undo the sign-in so the user isn't left half-authenticated.
      await signOut(auth);
      throw err;
    }
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
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
