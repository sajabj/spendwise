import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  User,
  LogOut,
  X,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { t } = useLanguage();
  const displayName = userProfile?.fullName || currentUser?.displayName || 'User';

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { to: '/expenses', labelKey: 'nav.expenses', icon: Receipt },
    { to: '/analytics', labelKey: 'nav.analytics', icon: PieChart },
    { to: '/profile', labelKey: 'nav.profile', icon: User }
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-title">{t('brandName')}</span>
              <span className="brand-badge">{t('saasBadge')}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-icon-only menu-toggle-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ display: isOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar">{getInitials(displayName)}</div>
            <div className="user-info">
              <div className="user-name">{displayName}</div>
              <div className="user-email">{currentUser?.email}</div>
            </div>
            <button
              type="button"
              className="btn-icon-only"
              onClick={logout}
              title={t('nav.logOut')}
              aria-label={t('nav.logOut')}
              style={{ color: '#fb7185' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
