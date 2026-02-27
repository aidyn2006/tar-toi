import React from 'react';
import { useLang } from '../context/LanguageContext';

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
                return (
                    <button
                        key={item.id}
                        onClick={() => setLang(item.id)}
                        style={{
                            ...btnBase,
                            ...pillStyle,
                            background: active ? '#10b981' : 'white',
                            color: active ? 'white' : '#064e3b',
                            borderColor: active ? '#10b981' : '#d7e9df',
                            boxShadow: active ? '0 8px 16px rgba(16,185,129,0.2)' : 'none',
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitch;
