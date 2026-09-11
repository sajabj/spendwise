import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';

const DEMO_USER_STORAGE_KEY = 'spendwise_demo_user';
const EXPENSES_STORAGE_PREFIX = 'spendwise_expenses_';

// Mock demo user profile
const DEFAULT_DEMO_USER = {
  uid: 'demo-user-123456',
  email: 'alex.morgan@example.com',
  displayName: 'Alex Morgan',
  fullName: 'Alex Morgan',
  createdAt: new Date().toISOString()
};

/**
 * Register a new user with email, password, and full name.
 */
export const registerUser = async (fullName, email, password) => {
  if (isFirebaseConfigured && auth && db) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile displayName
    await updateProfile(user, { displayName: fullName });

    // Create user document in Firestore users/{userId}
    await setDoc(doc(db, 'users', user.uid), {
      fullName,
      email,
      createdAt: serverTimestamp()
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      fullName
    };
  }

  // Demo fallback
  const demoUser = {
    uid: `demo-${Date.now()}`,
    email,
    displayName: fullName,
    fullName,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
  return demoUser;
};

/**
 * Login with email and password.
 */
export const loginUser = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const profile = await getUserProfile(user.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: profile?.fullName || user.displayName || 'User',
      fullName: profile?.fullName || user.displayName || 'User'
    };
  }

  // Demo fallback
  const existing = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  const demoUser = { ...DEFAULT_DEMO_USER, email };
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
  return demoUser;
};

/**
 * Login with Demo Account directly
 */
export const loginDemoUser = () => {
  const existing = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USER));
  return DEFAULT_DEMO_USER;
};

/**
 * Logout current user.
 */
export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
};

/**
 * Fetch user document from Firestore users/{userId}.
 */
export const getUserProfile = async (userId) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
    }
  }

  const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Update user full name in Firebase Auth & Firestore users/{userId}.
 */
export const updateUserProfile = async (user, { fullName }) => {
  if (isFirebaseConfigured && auth && db && user?.uid) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: fullName });
    }
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { fullName });
    return { fullName };
  }

  // Demo fallback
  const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  const current = stored ? JSON.parse(stored) : DEFAULT_DEMO_USER;
  const updated = { ...current, fullName, displayName: fullName };
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Change user email address with re-authentication
 */
export const changeUserEmail = async (user, newEmail, currentPassword) => {
  if (isFirebaseConfigured && auth && db && auth.currentUser) {
    const activeUser = auth.currentUser;
    // Re-authenticate user before email change
    const credential = EmailAuthProvider.credential(activeUser.email, currentPassword);
    await reauthenticateWithCredential(activeUser, credential);

    // Update email in Firebase Auth
    try {
      await updateEmail(activeUser, newEmail);
    } catch (err) {
      // If updateEmail fails due to newer SDK requirements, try verifyBeforeUpdateEmail
      if (typeof verifyBeforeUpdateEmail === 'function') {
        await verifyBeforeUpdateEmail(activeUser, newEmail);
      } else {
        throw err;
      }
    }

    // Update Firestore users/{userId} doc
    const docRef = doc(db, 'users', activeUser.uid);
    await updateDoc(docRef, { email: newEmail });

    return { email: newEmail };
  }

  // Demo fallback
  if (!currentPassword) {
    throw new Error('Current password is required.');
  }
  const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
  const current = stored ? JSON.parse(stored) : DEFAULT_DEMO_USER;
  const updated = { ...current, email: newEmail };
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Permanently delete user account and all associated Firestore data
 */
export const deleteUserAccount = async (user, currentPassword) => {
  if (isFirebaseConfigured && auth && db && auth.currentUser) {
    const activeUser = auth.currentUser;
    const userId = activeUser.uid;

    // Re-authenticate first
    const credential = EmailAuthProvider.credential(activeUser.email, currentPassword);
    await reauthenticateWithCredential(activeUser, credential);

    // 1. Delete all expenses in users/{userId}/expenses
    try {
      const expensesRef = collection(db, 'users', userId, 'expenses');
      const querySnapshot = await getDocs(expensesRef);
      const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    } catch (err) {
      console.warn('Could not batch delete subcollection expenses:', err);
    }

    // 2. Delete user profile doc users/{userId}
    try {
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
    } catch (err) {
      console.warn('Could not delete user profile doc:', err);
    }

    // 3. Delete Firebase Auth account
    await deleteUser(activeUser);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    return true;
  }

  // Demo fallback
  if (!currentPassword) {
    throw new Error('Current password is required.');
  }
  const userId = user?.uid || DEFAULT_DEMO_USER.uid;
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  localStorage.removeItem(`${EXPENSES_STORAGE_PREFIX}${userId}`);
  return true;
};
