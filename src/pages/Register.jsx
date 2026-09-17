import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useToast } from '../components/common/Toast';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loginDemo } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = t('auth.errors.fullNameRequired');
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = t('auth.errors.fullNameShort');
    }

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

    if (!formData.confirmPassword) {
      errs.confirmPassword = t('auth.errors.confirmRequired');
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = t('auth.errors.passwordsMismatch');
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
      await register(formData.fullName.trim(), formData.email.trim(), formData.password);
      addToast(t('profile.toastNameSuccess'), 'success');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      let msg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = t('auth.errors.emailInUse');
      } else if (err.code === 'auth/weak-password') {
        msg = t('auth.errors.weakPassword');
      } else if (err.code === 'auth/invalid-email') {
        msg = t('auth.errors.emailInvalid');
      }
      setAuthError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginDemo();
    addToast(t('auth.exploreDemoInstant'), 'info');
    navigate('/', { replace: true });
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
          <h1 className="auth-title">{t('auth.registerTitle')}</h1>
          <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
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
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-fullname">
              {t('auth.fullNameLabel')}
            </label>
            <input
              id="reg-fullname"
              type="text"
              className="form-input"
              placeholder={t('auth.fullNamePlaceholder')}
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              disabled={loading}
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              {t('auth.emailLabel')}
            </label>
            <input
              id="reg-email"
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
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              {t('auth.passwordLabel')}
            </label>
            <input
              id="reg-password"
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
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">
              {t('auth.confirmPasswordLabel')}
            </label>
            <input
              id="reg-confirm"
              type="password"
              className="form-input"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              disabled={loading}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <Button
            variant="primary"
            type="submit"
            loading={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {t('auth.createAccountBtn')}
          </Button>
        </form>

        <div className="auth-divider">{t('auth.orExplore')}</div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>{t('auth.exploreDemo')}</span>
        </button>

        <div className="auth-footer">
          {t('auth.haveAccountPrompt')}{' '}
          <Link
            to="/login"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            {t('auth.signInLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};
