import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryDoughnutChart = ({ categoryData }) => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#94a3b8' : '#475569';

  const hasData = categoryData && categoryData.datasets[0]?.data?.some((val) => val > 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(val);
            return ` ${context.label}: ${formatted}`;
          }
        }
      }
    }
  };

  if (!hasData) {
    return (
      <div
        style={{
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          color: 'var(--text-muted)'
        }}
      >
        <PieChart size={38} strokeWidth={1.5} />
        <p style={{ fontSize: '0.9rem' }}>No expenses recorded yet</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Doughnut data={categoryData} options={options} />
    </div>
  );
};
