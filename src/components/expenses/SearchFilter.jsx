import { Search, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../context/ExpenseContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

export const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  onClearFilters
}) => {
  const { t } = useLanguage();

  const isFiltered =
    searchTerm !== '' ||
    categoryFilter !== 'All' ||
    dateFilter !== '' ||
    sortBy !== 'date_desc';

  return (
    <div className="card filter-card">
      <div className="filter-controls">
        {/* Search by name */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder={t('expensesPage.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Category */}
        <div className="filter-item">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label={t('expensesPage.tableHeaders.category')}
          >
            <option value="All">{t('categories.all')}</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`categories.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Date */}
        <div className="filter-item">
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title={t('expensesPage.filterByDate')}
            aria-label={t('expensesPage.filterByDate')}
          />
        </div>

        {/* Sort Controls */}
        <div className="filter-item filter-item-sort">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label={t('expensesPage.sortBy')}
          >
            <option value="date_desc">{t('expensesPage.sortNewest')}</option>
            <option value="date_asc">{t('expensesPage.sortOldest')}</option>
            <option value="amount_desc">{t('expensesPage.sortHighest')}</option>
            <option value="amount_asc">{t('expensesPage.sortLowest')}</option>
          </select>
        </div>

        {/* Reset / Clear Filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={onClearFilters}
            className="filter-reset-btn"
            title={t('expensesPage.resetFilters')}
          >
            {t('expensesPage.resetFilters')}
          </Button>
        )}
      </div>
    </div>
  );
};
