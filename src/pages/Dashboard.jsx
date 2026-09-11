import { useOutletContext, Link } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { CategoryDoughnutChart } from '../components/charts/CategoryDoughnutChart';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Button';

export const Dashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { expenses, stats, categoryData, monthlyData, loading } = useExpenses();
  const { onOpenAddExpense, onOpenEditExpense, onOpenDeleteExpense } = useOutletContext();
  const { t, language, isRTL } = useLanguage();

  const displayName = userProfile?.fullName || currentUser?.displayName || 'User';

  const todayFormatted = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (loading && expenses.length === 0) {
    return <Loading message={t('common.loading')} />;
  }

  return (
    <div>
      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            {t('dashboard.welcomeBack')}, {displayName.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            {t('dashboard.snapshot')} {todayFormatted}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" icon={Plus} onClick={onOpenAddExpense}>
            {t('dashboard.logExpense')}
          </Button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="kpi-grid">
        <SummaryCard
          title={t('dashboard.totalExpenses')}
          value={stats.totalExpenses}
          subtitle={t('dashboard.allTimeCumulative')}
          icon={DollarSign}
          color="#6366f1"
        />
        <SummaryCard
          title={t('dashboard.thisMonth')}
          value={stats.thisMonthExpenses}
          subtitle={t('dashboard.currentCalendarMonth')}
          icon={Calendar}
          color="#06b6d4"
        />
        <SummaryCard
          title={t('dashboard.today')}
          value={stats.todayExpenses}
          subtitle={t('dashboard.spentLast24h')}
          icon={TrendingUp}
          color="#10b981"
        />
        <SummaryCard
          title={t('dashboard.totalTransactions')}
          value={stats.totalTransactions}
          subtitle={t('dashboard.loggedTransactions')}
          icon={CreditCard}
          color="#8b5cf6"
          isCurrency={false}
        />
      </div>

      {/* 2 Charts Grid */}
      <div className="charts-grid">
        <div className="card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">{t('dashboard.monthlyTrend')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('dashboard.monthlySubtitle')}
              </p>
            </div>
            <Link
              to="/analytics"
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {t('dashboard.analyticsLink')} <ArrowIcon size={14} />
            </Link>
          </div>
          <MonthlyBarChart monthlyData={monthlyData} />
        </div>

        <div className="card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">{t('dashboard.expensesByCategory')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('dashboard.categorySubtitle')}
              </p>
            </div>
          </div>
          <CategoryDoughnutChart categoryData={categoryData} />
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{t('dashboard.recentExpenses')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {t('dashboard.recentSubtitle')}
            </p>
          </div>
          <Link
            to="/expenses"
            style={{
              fontSize: '0.875rem',
              color: 'var(--primary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {t('dashboard.viewAll')} ({expenses.length}) <ArrowIcon size={14} />
          </Link>
        </div>

        <ExpenseList
          expenses={expenses}
          limit={5}
          onEdit={onOpenEditExpense}
          onDelete={onOpenDeleteExpense}
          onAddNew={onOpenAddExpense}
        />
      </div>
    </div>
  );
};
