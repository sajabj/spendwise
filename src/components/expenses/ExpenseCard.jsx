import { Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { t, language } = useLanguage();

  const formattedDate = expense.date
    ? new Date(expense.date + 'T00:00:00').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '—';

  const categoryLower = (expense.category || 'other').toLowerCase();
  const categoryTranslated = t(`categories.${expense.category || 'Other'}`);

  return (
    <div className="expense-mobile-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {expense.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <span className={`category-badge ${categoryLower}`}>
              {categoryTranslated}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="amount-text" style={{ fontSize: '1.15rem' }}>
          -${Number(expense.amount).toFixed(2)}
        </div>
      </div>

      {expense.description && (
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6
          }}
        >
          <FileText size={14} style={{ flexShrink: 0, marginTop: 3, color: 'var(--text-muted)' }} />
          <span>{expense.description}</span>
        </p>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.6rem',
          marginTop: '0.25rem'
        }}
      >
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
    </div>
  );
};
