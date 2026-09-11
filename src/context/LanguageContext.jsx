import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'spendwise_language';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, dir]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  /**
   * Helper function to retrieve nested translation keys with variable interpolation
   * Example: t('dashboard.welcomeBack') or t('confirmModal.confirmMessage', { title: 'Coffee', amount: '4.50' })
   */
  const t = useCallback(
    (keyPath, variables = {}) => {
      const keys = keyPath.split('.');
      let currentVal = translations[language];

      for (const k of keys) {
        if (currentVal && typeof currentVal === 'object' && k in currentVal) {
          currentVal = currentVal[k];
        } else {
          // Fallback to English
          let fallback = translations.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              fallback = null;
              break;
            }
          }
          currentVal = fallback || keyPath;
          break;
        }
      }

      if (typeof currentVal === 'string') {
        let result = currentVal;
        Object.entries(variables).forEach(([varKey, varVal]) => {
          result = result.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varVal));
        });
        return result;
      }

      return currentVal || keyPath;
    },
    [language]
  );

  const value = {
    language,
    dir,
    isRTL: dir === 'rtl',
    setLanguage,
    toggleLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
