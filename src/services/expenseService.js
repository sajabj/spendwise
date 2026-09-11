import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const EXPENSES_STORAGE_PREFIX = 'spendwise_expenses_';

// Initial rich sample data for Demo mode
const getSampleExpenses = () => {
  const now = new Date();
  const formatIsoDate = (d) => d.toISOString().split('T')[0];

  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const d3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
  const d4 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const d5 = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const d6 = new Date(now.getFullYear(), now.getMonth() - 1, 22);
  const d7 = new Date(now.getFullYear(), now.getMonth() - 2, 10);

  return [
    {
      id: 'exp-1',
      title: 'Whole Foods Grocery',
      amount: 142.50,
      category: 'Food',
      date: formatIsoDate(d1),
      description: 'Weekly organic grocery haul including fresh produce and pantry goods',
      createdAt: d1.toISOString(),
      updatedAt: d1.toISOString()
    },
    {
      id: 'exp-2',
      title: 'Metro Transit Monthly Pass',
      amount: 85.00,
      category: 'Transportation',
      date: formatIsoDate(d1),
      description: 'Subway & bus monthly pass subscription',
      createdAt: d1.toISOString(),
      updatedAt: d1.toISOString()
    },
    {
      id: 'exp-3',
      title: 'High-Speed Fiber Internet',
      amount: 69.99,
      category: 'Bills',
      date: formatIsoDate(d2),
      description: 'Monthly home fiber optic broadband connection',
      createdAt: d2.toISOString(),
      updatedAt: d2.toISOString()
    },
    {
      id: 'exp-4',
      title: 'Wireless Noise-Canceling Headphones',
      amount: 199.00,
      category: 'Shopping',
      date: formatIsoDate(d3),
      description: 'Upgraded work headphones for concentration',
      createdAt: d3.toISOString(),
      updatedAt: d3.toISOString()
    },
    {
      id: 'exp-5',
      title: 'Cinema & IMAX Tickets',
      amount: 38.00,
      category: 'Entertainment',
      date: formatIsoDate(d4),
      description: 'Movie night with friends',
      createdAt: d4.toISOString(),
      updatedAt: d4.toISOString()
    },
    {
      id: 'exp-6',
      title: 'Annual Dental Checkup & Cleaning',
      amount: 120.00,
      category: 'Health',
      date: formatIsoDate(d5),
      description: 'Preventative care routine checkup',
      createdAt: d5.toISOString(),
      updatedAt: d5.toISOString()
    },
    {
      id: 'exp-7',
      title: 'React & Cloud Architecture Masterclass',
      amount: 49.99,
      category: 'Education',
      date: formatIsoDate(d6),
      description: 'Online certification course on advanced web development',
      createdAt: d6.toISOString(),
      updatedAt: d6.toISOString()
    },
    {
      id: 'exp-8',
      title: 'Home Office Ergonomic Chair Cushion',
      amount: 34.50,
      category: 'Other',
      date: formatIsoDate(d7),
      description: 'Ergonomic lumbar support accessory',
      createdAt: d7.toISOString(),
      updatedAt: d7.toISOString()
    }
  ];
};

/**
 * Subscribe to real-time expense updates for a specific user.
 * Structure: users/{userId}/expenses/{expenseId}
 */
export const subscribeToExpenses = (userId, onData, onError) => {
  if (!userId) {
    onData([]);
    return () => {};
  }

  if (isFirebaseConfigured && db) {
    try {
      const expensesRef = collection(db, 'users', userId, 'expenses');
      const q = query(expensesRef, orderBy('date', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const expenses = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              // Convert Firestore Timestamp if present
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
            };
          });
          onData(expenses);
        },
        (error) => {
          console.error('Error in Firestore onSnapshot listener:', error);
          if (onError) onError(error);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up expense subscription:', err);
      if (onError) onError(err);
    }
  }

  // Demo fallback using localStorage with event synchronization
  const storageKey = `${EXPENSES_STORAGE_PREFIX}${userId}`;
  let stored = localStorage.getItem(storageKey);
  if (!stored) {
    const sample = getSampleExpenses();
    localStorage.setItem(storageKey, JSON.stringify(sample));
    stored = JSON.stringify(sample);
  }

  try {
    const parsed = JSON.parse(stored);
    onData(parsed);
  } catch {
    onData([]);
  }

  const handleCustomEvent = (e) => {
    if (e.detail?.userId === userId) {
      const updatedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      onData(updatedData);
    }
  };

  window.addEventListener('spendwise_expenses_changed', handleCustomEvent);
  return () => {
    window.removeEventListener('spendwise_expenses_changed', handleCustomEvent);
  };
};

/**
 * Add a new expense under users/{userId}/expenses
 */
export const addExpense = async (userId, expenseData) => {
  const numericAmount = parseFloat(expenseData.amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Please provide a valid positive amount.');
  }

  if (isFirebaseConfigured && db) {
    const expensesRef = collection(db, 'users', userId, 'expenses');
    const docRef = await addDoc(expensesRef, {
      title: expenseData.title.trim(),
      amount: numericAmount,
      category: expenseData.category,
      date: expenseData.date,
      description: expenseData.description ? expenseData.description.trim() : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  // Demo mode
  const storageKey = `${EXPENSES_STORAGE_PREFIX}${userId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const newExpense = {
    id: `exp-${Date.now()}`,
    title: expenseData.title.trim(),
    amount: numericAmount,
    category: expenseData.category,
    date: expenseData.date,
    description: expenseData.description ? expenseData.description.trim() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newExpense, ...existing];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('spendwise_expenses_changed', { detail: { userId } }));
  return newExpense.id;
};

/**
 * Update an existing expense at users/{userId}/expenses/{expenseId}
 */
export const updateExpense = async (userId, expenseId, expenseData) => {
  const numericAmount = parseFloat(expenseData.amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Please provide a valid positive amount.');
  }

  if (isFirebaseConfigured && db) {
    const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);
    await updateDoc(expenseDocRef, {
      title: expenseData.title.trim(),
      amount: numericAmount,
      category: expenseData.category,
      date: expenseData.date,
      description: expenseData.description ? expenseData.description.trim() : '',
      updatedAt: serverTimestamp()
    });
    return expenseId;
  }

  // Demo mode
  const storageKey = `${EXPENSES_STORAGE_PREFIX}${userId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updated = existing.map((exp) => {
    if (exp.id === expenseId) {
      return {
        ...exp,
        title: expenseData.title.trim(),
        amount: numericAmount,
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description ? expenseData.description.trim() : '',
        updatedAt: new Date().toISOString()
      };
    }
    return exp;
  });

  localStorage.setItem(storageKey, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('spendwise_expenses_changed', { detail: { userId } }));
  return expenseId;
};

/**
 * Delete an expense at users/{userId}/expenses/{expenseId}
 */
export const deleteExpense = async (userId, expenseId) => {
  if (isFirebaseConfigured && db) {
    const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);
    await deleteDoc(expenseDocRef);
    return expenseId;
  }

  // Demo mode
  const storageKey = `${EXPENSES_STORAGE_PREFIX}${userId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updated = existing.filter((exp) => exp.id !== expenseId);
  localStorage.setItem(storageKey, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('spendwise_expenses_changed', { detail: { userId } }));
  return expenseId;
};
