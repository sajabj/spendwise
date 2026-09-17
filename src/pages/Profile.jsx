import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Save,
  ShieldCheck,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';

export const Profile = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    userProfile,
    updateProfileName,
    changeEmail,
    deleteAccount
  } = useAuth();
  const { expenses } = useExpenses();
  const { t, language } = useLanguage();
  const { addToast } = useToast();

  // Full Name State
  const [fullName, setFullName] = useState(
    userProfile?.fullName || currentUser?.displayName || ''
  );
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Delete Account State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Format account creation date
  let createdFormatted = 'Recently';
  const rawCreation = userProfile?.createdAt || currentUser?.metadata?.creationTime;
  if (rawCreation) {
    try {
      createdFormatted = new Date(rawCreation).toLocaleDateString(
        language === 'ar' ? 'ar-EG' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
    } catch {
      createdFormatted = String(rawCreation);
    }
  }

  // 1. Handle Full Name Update
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setNameError(t('profile.nameRequired'));
      return;
    }
    if (fullName.trim().length < 2) {
      setNameError(t('profile.nameShort'));
      return;
    }

    setNameLoading(true);
    setNameError('');

    try {
      await updateProfileName(fullName.trim());
      addToast(t('profile.toastNameSuccess'), 'success');
    } catch (err) {
      console.error(err);
      setNameError(err.message || 'Failed to update name.');
      addToast(err.message || 'Could not update profile name.', 'error');
    } finally {
      setNameLoading(false);
    }
  };

  // 2. Handle Email Address Change
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError(t('profile.emailInvalid'));
      return;
    }

    if (!emailPassword) {
      setEmailError(t('profile.passwordRequired'));
      return;
    }

    setEmailLoading(true);

    try {
      await changeEmail(newEmail.trim(), emailPassword);
      addToast(t('profile.toastEmailSuccess'), 'success');
      setNewEmail('');
      setEmailPassword('');
    } catch (err) {
      console.error('Email update error:', err);
      let msg = err.message || 'Failed to update email address.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect current password. Re-authentication failed.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email address is already associated with another account.';
      } else if (err.code === 'auth/requires-recent-login') {
        msg = 'Security requirement: please sign out and sign in again before updating email.';
      }
      setEmailError(msg);
      addToast(msg, 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  // 3. Handle Delete Account
  const handleConfirmDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError(t('profile.passwordRequired'));
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteAccount(deletePassword);
      addToast(t('profile.toastDeleteSuccess'), 'info');
      setDeleteModalOpen(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Delete account error:', err);
      let msg = err.message || 'Failed to delete account.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect password. Could not verify account ownership.';
      } else if (err.code === 'auth/requires-recent-login') {
        msg = 'Please sign out and sign in again before deleting your account.';
      }
      setDeleteError(msg);
      addToast(msg, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          {t('profile.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('profile.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Profile Card Header */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div
            className="user-avatar"
            style={{
              width: 80,
              height: 80,
              fontSize: '1.85rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {getInitials(fullName || userProfile?.fullName)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>
              {userProfile?.fullName || currentUser?.displayName || 'User'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={15} />
              {currentUser?.email || 'user@example.com'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <ShieldCheck size={13} /> {t('profile.activeAccount')}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-card-hover)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {expenses.length} {t('profile.loggedTransactions')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Edit Full Name */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
            {t('profile.editInfo')}
          </h3>

          <form onSubmit={handleUpdateName}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-fullname">
                {t('profile.fullNameLabel')}
              </label>
              <input
                id="profile-fullname"
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
                disabled={nameLoading}
              />
              {nameError && <p className="form-error">{nameError}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email-readonly">
                {t('profile.emailLabel')}
              </label>
              <input
                id="profile-email-readonly"
                type="email"
                className="form-input"
                value={currentUser?.email || ''}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('profile.emailHelpText')}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">{t('profile.accountCreated')}</label>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Calendar size={16} />
                <span>{createdFormatted}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="primary" type="submit" icon={Save} loading={nameLoading}>
                {t('profile.saveNameBtn')}
              </Button>
            </div>
          </form>
        </div>

        {/* Section 2: Change Email Address */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
            {t('profile.changeEmailTitle')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {t('profile.changeEmailDesc')}
          </p>

          <form onSubmit={handleChangeEmail}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-new-email">
                {t('profile.newEmailLabel')}
              </label>
              <input
                id="profile-new-email"
                type="email"
                className="form-input"
                placeholder={t('profile.newEmailPlaceholder')}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={emailLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email-pass">
                {t('profile.currentPasswordLabel')}
              </label>
              <input
                id="profile-email-pass"
                type="password"
                className="form-input"
                placeholder={t('profile.currentPasswordPlaceholder')}
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                disabled={emailLoading}
              />
              {emailError && <p className="form-error">{emailError}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Button variant="secondary" type="submit" loading={emailLoading}>
                {t('profile.updateEmailBtn')}
              </Button>
            </div>
          </form>
        </div>

        {/* Section 3: Danger Zone - Delete Account */}
        <div className="card danger-card">
          <h3 className="danger-title" style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
            <AlertTriangle size={20} />
            {t('profile.dangerZoneTitle')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {t('profile.deleteAccountDesc')}
          </p>

          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => {
              setDeletePassword('');
              setDeleteError('');
              setDeleteModalOpen(true);
            }}
          >
            {t('profile.deleteAccountBtn')}
          </Button>
        </div>

        {/* Data Privacy Note */}
        <div className="card" style={{ backgroundColor: 'var(--bg-glass-card)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={18} color="var(--primary)" />
            {t('profile.privacyTitle')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {t('profile.privacyDesc')}
          </p>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleteLoading && setDeleteModalOpen(false)}
        title={t('profile.deleteModalTitle')}
        maxWidth="460px"
      >
        <form onSubmit={handleConfirmDeleteAccount}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(244, 63, 94, 0.25)'
              }}
            >
              <AlertTriangle size={22} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.875rem', color: '#fb7185', lineHeight: 1.4 }}>
                {t('profile.deleteModalWarning')}
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="delete-confirm-password">
                {t('profile.deletePasswordConfirmPrompt')}
              </label>
              <input
                id="delete-confirm-password"
                type="password"
                className="form-input"
                placeholder={t('profile.currentPasswordPlaceholder')}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deleteLoading}
                autoFocus
              />
              {deleteError && <p className="form-error">{deleteError}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                type="submit"
                loading={deleteLoading}
              >
                {t('profile.confirmDeleteBtn')}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
