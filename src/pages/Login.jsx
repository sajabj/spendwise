import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Sparkles, ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useToast } from '../components/common/Toast';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo, resetPassword, isFirebaseConfigured } = useAuth();
  const { t, isRTL } = useLanguage();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState('login'); // 'login' | 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const validateLogin = () => {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validateLogin()) return;

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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotEmail.trim()) {
      setForgotError(t('auth.errors.emailRequired'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError(t('auth.errors.emailInvalid'));
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(true);
      addToast(t('auth.resetEmailSent'), 'success');
    } catch (err) {
      console.error('Password reset error:', err);
      let msg = t('auth.errors.resetFailed');
      if (err.code === 'auth/user-not-found') {
        msg = t('auth.errors.userNotFound');
      } else if (err.code === 'auth/invalid-email') {
        msg = t('auth.errors.emailInvalid');
      }
      setForgotError(msg);
      addToast(msg, 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top language toggle bar */}
      <div className="auth-topbar">
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
          <h1 className="auth-title">
            {viewMode === 'forgot' ? t('auth.forgotPasswordTitle') : t('auth.loginTitle')}
          </h1>
          <p className="auth-subtitle">
            {viewMode === 'forgot'
              ? t('auth.forgotPasswordSubtitle')
              : t('auth.loginSubtitle')}
          </p>
        </div>

        {viewMode === 'login' ? (
          <>
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

            <form onSubmit={handleLoginSubmit} noValidate>
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
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Password with Forgot Password trigger */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-password">
                    {t('auth.passwordLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(formData.email || '');
                      setForgotError('');
                      setForgotSuccess(false);
                      setViewMode('forgot');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: '0.25rem'
                    }}
                  >
                    {t('auth.forgotPasswordLink')}
                  </button>
                </div>
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
                    autoComplete="current-password"
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
          </>
        ) : (
          /* Forgot Password View */
          <div>
            {forgotSuccess && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: '#34d399',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  lineHeight: 1.45
                }}
              >
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
                  {t('auth.resetEmailSent')}
                </strong>
                <span>{t('auth.resetEmailSentDesc', { email: forgotEmail })}</span>
                {!isFirebaseConfigured && (
                  <p style={{ marginTop: '0.45rem', fontSize: '0.75rem', color: '#fbbf24' }}>
                    {t('auth.resetDemoNotice')}
                  </p>
                )}
              </div>
            )}

            {forgotError && (
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
                {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">
                  {t('auth.emailLabel')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input"
                    placeholder={t('auth.emailPlaceholder')}
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    disabled={forgotLoading}
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                loading={forgotLoading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Mail size={16} />
                <span>{t('auth.sendResetLinkBtn')}</span>
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setForgotError('');
                setForgotSuccess(false);
              }}
              className="btn btn-secondary"
              style={{
                width: '100%',
                marginTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <BackIcon size={16} />
              <span>{t('auth.backToLogin')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
