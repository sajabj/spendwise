import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from '../services/expenseService';

const ExpenseContext = createContext(null);

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other'
];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transportation: '#0ea5e9',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Entertainment: '#8b5cf6',
  Health: '#10b981',
  Education: '#3b82f6',
  Other: '#64748b'
};

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(''); // specific date YYYY-MM-DD
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, amount_desc, amount_asc

  // Subscribe to real-time expenses when user changes
  useEffect(() => {
    if (!currentUser?.uid) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToExpenses(
      currentUser.uid,
      (data) => {
        setExpenses(data);
        setLoading(false);
      },
      (err) => {
        console.error('Expense subscription error:', err);
        setError('Failed to sync expenses. Please check your connection.');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser?.uid]);

  // CRUD actions
  const handleAddExpense = async (expenseData) => {
    if (!currentUser?.uid) throw new Error('You must be logged in.');
    return await addExpense(currentUser.uid, expenseData);
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    if (!currentUser?.uid) throw new Error('You must be logged in.');
    return await updateExpense(currentUser.uid, expenseId, expenseData);
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!currentUser?.uid) throw new Error('You must be logged in.');
    return await deleteExpense(currentUser.uid, expenseId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setDateFilter('');
    setDateRangeFilter({ start: '', end: '' });
    setSortBy('date_desc');
  };

  // Filtered and Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Search by expense name / title
        if (searchTerm.trim()) {
          const matchTitle = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchDesc = item.description?.toLowerCase().includes(searchTerm.toLowerCase());
          if (!matchTitle && !matchDesc) return false;
        }

        // Category filter
        if (categoryFilter && categoryFilter !== 'All') {
          if (item.category !== categoryFilter) return false;
        }

        // Exact date filter
        if (dateFilter) {
          if (item.date !== dateFilter) return false;
        }

        // Date range filter
        if (dateRangeFilter.start && item.date < dateRangeFilter.start) {
          return false;
        }
        if (dateRangeFilter.end && item.date > dateRangeFilter.end) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date_asc':
            return new Date(a.date) - new Date(b.date);
          case 'date_desc':
            return new Date(b.date) - new Date(a.date);
          case 'amount_desc':
            return Number(b.amount) - Number(a.amount);
          case 'amount_asc':
            return Number(a.amount) - Number(b.amount);
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });
  }, [expenses, searchTerm, categoryFilter, dateFilter, dateRangeFilter, sortBy]);

  // Dashboard KPI metrics
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    let total = 0;
    let thisMonth = 0;
    let today = 0;

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      total += amt;

      if (item.date === todayStr) {
        today += amt;
      }

      if (item.date) {
        const itemDate = new Date(item.date);
        if (
          itemDate.getFullYear() === currentYear &&
          itemDate.getMonth() === currentMonth
        ) {
          thisMonth += amt;
        }
      }
    });

    return {
      totalExpenses: total,
      thisMonthExpenses: thisMonth,
      todayExpenses: today,
      totalTransactions: expenses.length
    };
  }, [expenses]);

  // Category breakdown for Doughnut Chart
  const categoryData = useMemo(() => {
    const totals = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      totals[cat] = 0;
    });

    expenses.forEach((item) => {
      const cat = item.category || 'Other';
      const amt = Number(item.amount) || 0;
      if (totals[cat] !== undefined) {
        totals[cat] += amt;
      } else {
        totals['Other'] = (totals['Other'] || 0) + amt;
      }
    });

    const activeCategories = EXPENSE_CATEGORIES.filter((cat) => totals[cat] > 0);
    const labels = activeCategories.length > 0 ? activeCategories : ['No Expenses'];
    const data = activeCategories.length > 0 ? activeCategories.map((c) => totals[c]) : [0];
    const backgroundColors = activeCategories.length > 0
      ? activeCategories.map((c) => CATEGORY_COLORS[c] || '#64748b')
      : ['#334155'];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: '#0f172a',
          borderWidth: 2,
          hoverOffset: 6
        }
      ],
      totals
    };
  }, [expenses]);

  // Monthly breakdown for Bar Chart (last 6 months)
  const monthlyData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const months = [];

    // Get last 6 months in chronological order
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`,
        total: 0
      });
    }

    expenses.forEach((item) => {
      if (!item.date) return;
      const d = new Date(item.date);
      const amt = Number(item.amount) || 0;
      const entry = months.find((m) => m.year === d.getFullYear() && m.month === d.getMonth());
      if (entry) {
        entry.total += amt;
      }
    });

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: 'Monthly Spending ($)',
          data: months.map((m) => m.total),
          backgroundColor: '#6366f1',
          hoverBackgroundColor: '#818cf8',
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    };
  }, [expenses]);

  const value = {
    expenses,
    filteredExpenses,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    dateRangeFilter,
    setDateRangeFilter,
    sortBy,
    setSortBy,
    stats,
    categoryData,
    monthlyData,
    addExpense: handleAddExpense,
    updateExpense: handleUpdateExpense,
    deleteExpense: handleDeleteExpense,
    clearFilters
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
