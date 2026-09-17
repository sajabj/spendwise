import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../../context/ExpenseContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const ExpenseForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { t } = useLanguage();
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayDate(),
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category: initialData.category || 'Food',
        date: initialData.date || getTodayDate(),
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: getTodayDate(),
        description: ''
      });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('expenseForm.errors.titleRequired');
    } else if (formData.title.trim().length < 2) {
      newErrors.title = t('expenseForm.errors.titleShort');
    }

    if (!formData.amount) {
      newErrors.amount = t('expenseForm.errors.amountRequired');
    } else {
      const num = parseFloat(formData.amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = t('expenseForm.errors.amountInvalid');
      }
    }

    if (!formData.category || !EXPENSE_CATEGORIES.includes(formData.category)) {
      newErrors.category = t('expenseForm.errors.categoryInvalid');
    }

    if (!formData.date) {
      newErrors.date = t('expenseForm.errors.dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-title">
          {t('expenseForm.nameLabel')} *
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="expense-title"
            type="text"
            className="form-input"
            placeholder={t('expenseForm.namePlaceholder')}
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={loading}
          />
        </div>
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      {/* Amount & Date in 2-column layout */}
      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="expense-amount">
            {t('expenseForm.amountLabel')} *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              disabled={loading}
            />
          </div>
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-date">
            {t('expenseForm.dateLabel')} *
          </label>
          <input
            id="expense-date"
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            disabled={loading}
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-category">
          {t('expenseForm.categoryLabel')} *
        </label>
        <select
          id="expense-category"
          className="form-select"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          disabled={loading}
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-description">
          {t('expenseForm.descriptionLabel')}
        </label>
        <textarea
          id="expense-description"
          rows="3"
          className="form-textarea"
          placeholder={t('expenseForm.descPlaceholder')}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {t('expenseForm.cancelBtn')}
          </Button>
        )}
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? t('expenseForm.saveBtn') : t('expenseForm.addBtn')}
        </Button>
      </div>
    </form>
  );
};
