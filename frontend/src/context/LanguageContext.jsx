import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const LanguageContext = createContext({
    lang: 'kk',
    setLang: () => {},
    t: (kk, ru) => kk ?? ru ?? '',
});

const STORAGE_KEY = 'shaqyrtu_lang';

const getStoredLanguage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch (_) {
        return null;
    }
};

export const LanguageProvider = ({ children, initialLang }) => {
    const [lang, setLang] = useState(() => initialLang || getStoredLanguage() || 'kk');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, lang);
        }
    }, [lang]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
    }, [lang]);

    const setLanguage = useCallback((value) => {
        setLang(value);
    }, []);

    const t = useCallback(
        (kk, ru) => (lang === 'ru' ? ru ?? kk ?? '' : kk ?? ru ?? ''),
        [lang]
    );

    const value = useMemo(() => ({ lang, setLang: setLanguage, t }), [lang, setLanguage, t]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);
