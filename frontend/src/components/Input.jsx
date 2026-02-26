import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, error, icon: Icon, ...props }) => {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <div className="input-wrapper">
                {Icon && (
                    <span className="input-icon">
                        <Icon size={18} />
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`form-input${Icon ? ' has-icon' : ''}${error ? ' error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default Input;
