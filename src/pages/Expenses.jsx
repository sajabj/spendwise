import { useOutletContext } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { SearchFilter } from '../components/expenses/SearchFilter';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';

export const Expenses = () => {
  const {
    expenses,
    filteredExpenses,
    loading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    clearFilters
  } = useExpenses();

  const { onOpenAddExpense, onOpenEditExpense, onOpenDeleteExpense } = useOutletContext();
  const { t } = useLanguage();

  // Export to CSV feature
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) return;
    const headers = [
      t('expensesPage.tableHeaders.details'),
      t('expensesPage.tableHeaders.amount'),
      t('expensesPage.tableHeaders.category'),
      t('expensesPage.tableHeaders.date'),
      'Description'
    ];
    const rows = filteredExpenses.map((exp) => [
      `"${exp.title?.replace(/"/g, '""') || ''}"`,
      exp.amount,
      `"${t(`categories.${exp.category || 'Other'}`)}"`,
      `"${exp.date || ''}"`,
      `"${exp.description?.replace(/"/g, '""') || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && expenses.length === 0) {
    return <Loading message={t('common.loading')} />;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            {t('expensesPage.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {t('expensesPage.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {filteredExpenses.length > 0 && (
            <Button variant="secondary" icon={Download} onClick={exportToCSV}>
              {t('expensesPage.exportCsv')}
            </Button>
          )}
          <Button variant="primary" icon={Plus} onClick={onOpenAddExpense}>
            {t('expensesPage.addExpense')}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={clearFilters}
      />

      {/* Results Meta Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}
      >
        <span>
          {t('expensesPage.showing')} <strong>{filteredExpenses.length}</strong>{' '}
          {t('expensesPage.of')} <strong>{expenses.length}</strong>{' '}
          {t('expensesPage.expensesCount')}
        </span>
        {filteredExpenses.length > 0 && (
          <span>
            {t('expensesPage.filteredTotal')}:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              ${filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0).toFixed(2)}
            </strong>
          </span>
        )}
      </div>

      {/* Full Expense List */}
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={onOpenEditExpense}
        onDelete={onOpenDeleteExpense}
        onAddNew={onOpenAddExpense}
      />
    </div>
  );
};
