import { Edit2, Trash2, Calendar, FileText, Inbox } from 'lucide-react';
import { ExpenseCard } from './ExpenseCard';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export const ExpenseList = ({
  expenses = [],
  onEdit,
  onDelete,
  onAddNew,
  limit = null
}) => {
  const { t, language, isRTL } = useLanguage();
  const displayedExpenses = limit ? expenses.slice(0, limit) : expenses;

  if (displayedExpenses.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon-box">
          <Inbox size={34} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
          {t('expensesPage.noExpensesFound')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '360px', marginBottom: '1.25rem' }}>
          {t('expensesPage.noExpensesDesc')}
        </p>
        {onAddNew && (
          <Button variant="primary" onClick={onAddNew}>
            {t('expensesPage.addFirstExpense')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Desktop & Tablet Table */}
      <div className="card desktop-table" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('expensesPage.tableHeaders.details')}</th>
                <th>{t('expensesPage.tableHeaders.category')}</th>
                <th>{t('expensesPage.tableHeaders.date')}</th>
                <th>{t('expensesPage.tableHeaders.amount')}</th>
                <th style={{ textAlign: isRTL ? 'left' : 'right' }}>
                  {t('expensesPage.tableHeaders.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedExpenses.map((expense) => {
                const categoryLower = (expense.category || 'other').toLowerCase();
                const categoryTranslated = t(`categories.${expense.category || 'Other'}`);
                const formattedDate = expense.date
                  ? new Date(expense.date + 'T00:00:00').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : '—';

                return (
                  <tr key={expense.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {expense.title}
                        </div>
                        {expense.description && (
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              marginTop: '0.15rem',
                              maxWidth: 320,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {expense.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`category-badge ${categoryLower}`}>
                        {categoryTranslated}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {formattedDate}
                    </td>
                    <td>
                      <span className="amount-text">
                        -${Number(expense.amount).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: isRTL ? 'left' : 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-icon-only"
                          onClick={() => onEdit(expense)}
                          title={t('common.edit')}
                          aria-label={t('common.edit')}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-only"
                          onClick={() => onDelete(expense)}
                          title={t('common.delete')}
                          aria-label={t('common.delete')}
                          style={{ color: '#fb7185' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="mobile-expense-cards">
        {displayedExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
