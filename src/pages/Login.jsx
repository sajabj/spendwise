import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useToast } from '../components/common/Toast';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = t('auth.errors.emailInvalid');
    }

    if (!formData.password) {
      errs.password = t('auth.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      errs.password = t('auth.errors.passwordShort');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      addToast(t('dashboard.welcomeBack'), 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let msg = t('auth.errors.invalidCredential');
      setAuthError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginDemo();
    addToast(t('auth.exploreDemoInstant'), 'info');
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      {/* Top language toggle switch */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <div className="brand-icon" style={{ width: 44, height: 44 }}>
              <Wallet size={24} />
            </div>
            <span className="brand-title" style={{ fontSize: '1.6rem' }}>
              {t('brandName')}
            </span>
          </div>
          <h1 className="auth-title">{t('auth.loginTitle')}</h1>
          <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
        </div>

        {authError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fb7185',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              {t('auth.emailLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              {t('auth.passwordLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder={t('auth.passwordPlaceholder')}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                disabled={loading}
              />
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <Button
            variant="primary"
            type="submit"
            loading={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {t('auth.signInBtn')}
          </Button>
        </form>

        <div className="auth-divider">{t('auth.orExplore')}</div>

        {/* Demo Account 1-Click Login */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>{t('auth.exploreDemoInstant')}</span>
        </button>

        <div className="auth-footer">
          {t('auth.noAccountPrompt')}{' '}
          <Link
            to="/register"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            {t('auth.createAccountLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};
