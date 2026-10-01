import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  signInWithPopup,
  signOut
} from "../firebase/config.js";
import {
  getFirestoreUser,
  saveFirestoreUser,
  getOfficerProfile,
  saveOfficerProfile
} from "../services/firestoreService.js";
import { api } from "../services/api.js";
import * as demoData from "../data/mockDataset.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [officerProfile, setOfficerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");

  // Restore session from localStorage on mount
  useEffect(() => {
    async function initSession() {
      const savedUserJson = localStorage.getItem("statskill_user");
      if (savedUserJson) {
        try {
          const parsed = JSON.parse(savedUserJson);
          setCurrentUser(parsed);
          if (parsed.role === "OFFICER") {
            const profile = await getOfficerProfile(parsed.uid);
            setOfficerProfile(profile);
          }
        } catch (e) {
          console.error("Failed to restore session:", e);
        }
      }
      setLoading(false);
    }

    // If Firebase Auth is live, listen to auth state changes
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // Check if user exists in Firestore
          const existingUser = await getFirestoreUser(firebaseUser.uid);
          if (existingUser && existingUser.role) {
            setCurrentUser(existingUser);
            localStorage.setItem("statskill_user", JSON.stringify(existingUser));
            if (existingUser.role === "OFFICER") {
              const prof = await getOfficerProfile(existingUser.uid);
              setOfficerProfile(prof);
            }
          } else {
            // New user without role selected yet
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Statistical Cadre Member",
              photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
              role: null,
              createdAt: new Date().toISOString()
            };
            setCurrentUser(newUser);
            setRoleModalOpen(true);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      initSession();
    }
  }, []);

  // Google Sign-In
  const loginWithGoogle = async () => {
    setAuthError("");
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const existing = await getFirestoreUser(fbUser.uid);
        if (existing && existing.role) {
          setCurrentUser(existing);
          localStorage.setItem("statskill_user", JSON.stringify(existing));
          if (existing.role === "OFFICER") {
            const prof = await getOfficerProfile(existing.uid);
            setOfficerProfile(prof);
          }
        } else {
          const newUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || "Cadre Member",
            photoURL: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            role: null,
            createdAt: new Date().toISOString()
          };
          setCurrentUser(newUser);
          setRoleModalOpen(true);
        }
      } catch (err) {
        setAuthError(err.message || "Failed to sign in with Google.");
      }
    } else {
      // Prototype demo sign in with Google mock account
      const mockGoogleUser = {
        uid: "google_officer_demo_" + Date.now().toString().slice(-4),
        email: "cadre.officer@nic.in",
        displayName: "Statistical Cadre Officer",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        role: null,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(mockGoogleUser);
      setRoleModalOpen(true);
    }
  };

  // Direct 1-Click Demo Login for Officer (Ananya Sharma)
  const loginAsDemoOfficer = async () => {
    setAuthError("");
    const user = { ...demoData.DEMO_OFFICER_USER };
    const profile = { ...demoData.DEMO_OFFICER_PROFILE };
    setCurrentUser(user);
    setOfficerProfile(profile);
    localStorage.setItem("statskill_user", JSON.stringify(user));
    await saveFirestoreUser(user);
    await saveOfficerProfile(user.uid, profile);
    setRoleModalOpen(false);
  };

  // Direct 1-Click Demo Login for Trainer (Dr. Rajesh Verma)
  const loginAsDemoTrainer = async () => {
    setAuthError("");
    const user = { ...demoData.DEMO_TRAINER_USER };
    setCurrentUser(user);
    localStorage.setItem("statskill_user", JSON.stringify(user));
    await saveFirestoreUser(user);
    setRoleModalOpen(false);
  };

  // Assign Officer Role after role selection modal
  const assignOfficerRole = async (profileData = {}) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      role: "OFFICER",
      isProfileComplete: true,
      lastLogin: new Date().toISOString()
    };
    const defaultProfile = {
      ...demoData.DEMO_OFFICER_PROFILE,
      fullName: currentUser.displayName || demoData.DEMO_OFFICER_PROFILE.fullName,
      email: currentUser.email || demoData.DEMO_OFFICER_PROFILE.email,
      ...profileData,
      userId: currentUser.uid,
      updatedAt: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setOfficerProfile(defaultProfile);
    localStorage.setItem("statskill_user", JSON.stringify(updatedUser));
    await saveFirestoreUser(updatedUser);
    await saveOfficerProfile(currentUser.uid, defaultProfile);
    setRoleModalOpen(false);
  };

  // Validate Trainer Access Code Server-Side
  const validateAndAssignTrainerRole = async (accessCode) => {
    setAuthError("");
    try {
      const response = await api.validateTrainerCode(accessCode, {
        userId: currentUser?.uid,
        email: currentUser?.email
      });

      if (response.authorized) {
        const updatedUser = {
          ...currentUser,
          role: "TRAINER",
          isProfileComplete: true,
          lastLogin: new Date().toISOString()
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("statskill_user", JSON.stringify(updatedUser));
        await saveFirestoreUser(updatedUser);
        setTrainerModalOpen(false);
        setRoleModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      setAuthError(err.message || "Invalid trainer access code.");
      return { success: false, error: err.message };
    }
  };

  // Update Officer Profile
  const updateProfile = async (newProfileData) => {
    if (!currentUser || currentUser.role !== "OFFICER") return;
    const merged = { ...officerProfile, ...newProfileData };
    setOfficerProfile(merged);
    await saveOfficerProfile(currentUser.uid, merged);
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase signOut error:", e);
      }
    }
    setCurrentUser(null);
    setOfficerProfile(null);
    localStorage.removeItem("statskill_user");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        officerProfile,
        loading,
        authError,
        roleModalOpen,
        trainerModalOpen,
        setRoleModalOpen,
        setTrainerModalOpen,
        loginWithGoogle,
        loginAsDemoOfficer,
        loginAsDemoTrainer,
        assignOfficerRole,
        validateAndAssignTrainerRole,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
