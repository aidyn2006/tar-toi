import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const LanguageContext = createContext({
    lang: 'kk',
    setLang: () => {},
    t: (kk, ru) => kk ?? ru ?? '',
});

const STORAGE_KEY = 'shaqyrtu_lang';

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'kk');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, lang);
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
