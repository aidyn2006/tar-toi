import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { resolveLocalizedPathname } from '../seo/publicRoutes';

const btnBase = {
    padding: '0.35rem 0.85rem',
    borderRadius: '999px',
    border: '1.5px solid #d7e9df',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
};

const LanguageSwitch = ({ compact = false }) => {
    const { lang, setLang } = useLang();
    const location = useLocation();
    const pillStyle = compact
        ? { padding: '0.25rem 0.65rem', fontSize: '0.8rem', borderRadius: '12px' }
        : {};

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            {[
                { id: 'kk', label: 'Қаз' },
                { id: 'ru', label: 'Рус' },
            ].map((item) => {
                const active = lang === item.id;
                const localizedPath = resolveLocalizedPathname(location.pathname, item.id);
                const sharedStyle = {
                    ...btnBase,
                    ...pillStyle,
                    background: active ? '#10b981' : 'white',
                    color: active ? 'white' : '#064e3b',
                    borderColor: active ? '#10b981' : '#d7e9df',
                    boxShadow: active ? '0 8px 16px rgba(16,185,129,0.2)' : 'none',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                };

                if (localizedPath) {
                    return (
                        <Link
                            key={item.id}
                            to={`${localizedPath}${location.search}${location.hash}`}
                            onClick={() => setLang(item.id)}
                            aria-current={active ? 'true' : undefined}
                            style={sharedStyle}
                        >
                            {item.label}
                        </Link>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => setLang(item.id)}
                        style={sharedStyle}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitch;
