import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", disabled, style: extraStyle = {} }) => {
    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        fontWeight: '600',
        fontSize: '0.9375rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        transition: 'all 0.2s ease',
        fontFamily: "'Manrope', sans-serif",
        opacity: disabled ? 0.6 : 1,
        ...extraStyle
    };

    const variants = {
        primary: {
            background: '#10b981',
            color: 'white',
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
        },
        secondary: {
            background: '#fbbf24',
            color: '#064e3b',
            boxShadow: '0 4px 14px rgba(251,191,36,0.3)'
        },
        outline: {
            background: 'transparent',
            color: '#10b981',
            border: '2px solid #10b981'
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="btn"
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
        </button>
    );
};

export default Button;
