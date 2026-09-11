import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Sun, Moon, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const Navbar = ({ onOpenSidebar, onOpenAddExpense }) => {
  const { currentUser, userProfile, logout, isFirebaseConfigured } = useAuth();
  const { t, isRTL } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem('spendwise_theme') || 'dark');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendwise_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = userProfile?.fullName || currentUser?.displayName || 'User';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onOpenSidebar}
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {!isFirebaseConfigured && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
            title={t('demoModeTooltip')}
          >
            <ShieldAlert size={14} />
            <span>{t('demoModeBadge')}</span>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick Add Expense Button */}
        <Button
          variant="primary"
          icon={Plus}
          onClick={onOpenAddExpense}
          className="btn-add-quick"
        >
          {t('nav.addExpense')}
        </Button>

        {/* User Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            style={{
              background: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)'
            }}
            aria-expanded={userDropdownOpen}
          >
            <div className="user-avatar" style={{ width: 38, height: 38, fontSize: '0.875rem' }}>
              {getInitials(displayName)}
            </div>
          </button>

          {userDropdownOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                onClick={() => setUserDropdownOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: isRTL ? 'auto' : 0,
                  left: isRTL ? 0 : 'auto',
                  top: 'calc(100% + 8px)',
                  width: 220,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 70
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {displayName}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <UserIcon size={16} />
                  <span>{t('nav.myProfile')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: '#fb7185',
                    background: 'none',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} />
                  <span>{t('nav.logOut')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
