import { useExpenses, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { CategoryDoughnutChart } from '../components/charts/CategoryDoughnutChart';
import { Loading } from '../components/common/Loading';

export const Analytics = () => {
  const { expenses, stats, categoryData, monthlyData, loading } = useExpenses();
  const { t, language } = useLanguage();

  if (loading && expenses.length === 0) {
    return <Loading message={t('common.loading')} />;
  }

  // Calculate detailed category breakdown stats
  const categoryStats = EXPENSE_CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat);
    const total = catExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const count = catExpenses.length;
    const percentage = stats.totalExpenses > 0 ? ((total / stats.totalExpenses) * 100).toFixed(1) : '0.0';
    const average = count > 0 ? (total / count).toFixed(2) : '0.00';

    return {
      category: cat,
      categoryLabel: t(`categories.${cat}`),
      total,
      count,
      percentage,
      average,
      color: CATEGORY_COLORS[cat] || '#64748b'
    };
  })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  // Highest 3 individual expenses
  const topExpenses = [...expenses]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 3);

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          {t('analytics.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('analytics.subtitle')}
        </p>
      </div>

      {/* Main Charts */}
      <div className="charts-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">{t('analytics.monthlyTrend')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('analytics.monthlySubtitle')}
              </p>
            </div>
          </div>
          <MonthlyBarChart monthlyData={monthlyData} />
        </div>

        <div className="card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">{t('analytics.spendingByCategory')}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('analytics.categorySubtitle')}
              </p>
            </div>
          </div>
          <CategoryDoughnutChart categoryData={categoryData} />
        </div>
      </div>

      {/* Category Performance Breakdown Table */}
      <div className="card" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>{t('analytics.distributionTitle')}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('analytics.distributionSubtitle')}
          </p>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('analytics.tableCategory')}</th>
                <th>{t('analytics.tableTotal')}</th>
                <th>{t('analytics.tableShare')}</th>
                <th>{t('analytics.tableTx')}</th>
                <th>{t('analytics.tableAvg')}</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {t('analytics.noData')}
                  </td>
                </tr>
              ) : (
                categoryStats.map((item) => (
                  <tr key={item.category}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            flexShrink: 0
                          }}
                        />
                        <span style={{ fontWeight: 600 }}>{item.categoryLabel}</span>
                      </div>
                    </td>
                    <td>
                      <span className="amount-text">${item.total.toFixed(2)}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: 80,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'var(--bg-glass-card)',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(Number(item.percentage), 100)}%`,
                              height: '100%',
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.count}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>${item.average}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 3 Big Spends */}
      {topExpenses.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            {t('analytics.topExpensesTitle')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {t('analytics.topExpensesSubtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {topExpenses.map((exp, idx) => (
              <div
                key={exp.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                    #{idx + 1} {t('analytics.biggestBadge')}
                  </span>
                  <span className="amount-text" style={{ fontSize: '1.1rem' }}>
                    -${Number(exp.amount).toFixed(2)}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.4rem' }}>
                  {exp.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {t(`categories.${exp.category || 'Other'}`)} • {exp.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
