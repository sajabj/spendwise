import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.2rem',
        gap: '0.25rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.35rem 0.45rem',
          color: 'var(--text-muted)'
        }}
      >
        <Globe size={16} />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        style={{
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: language === 'en' ? 700 : 500,
          backgroundColor: language === 'en' ? 'var(--primary)' : 'transparent',
          color: language === 'en' ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)'
        }}
        aria-label="Switch to English"
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ar')}
        style={{
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: language === 'ar' ? 700 : 500,
          backgroundColor: language === 'ar' ? 'var(--primary)' : 'transparent',
          color: language === 'ar' ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)',
          fontFamily: "'Tajawal', 'Cairo', sans-serif"
        }}
        aria-label="التبديل إلى العربية"
      >
        العربية
      </button>
    </div>
  );
};
