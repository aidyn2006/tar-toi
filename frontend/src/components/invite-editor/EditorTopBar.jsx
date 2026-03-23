import React from 'react';
import { ArrowLeft, Check, Eye, Save, Share2, Trash2 } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

const EditorTopBar = ({
    title,
    canDelete,
    saving,
    saved,
    copied,
    onBack,
    onOpenPreview,
    onShare,
    onDelete,
    onSave,
    colors,
}) => {
    const { t } = useLang();
    const tr = (kk, ru) => t(kk, ru);

    return (
        <header
            className="edit-topbar"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 200,
                background: colors.white,
                borderBottom: `1px solid ${colors.border}`,
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 12px rgba(139,75,75,0.08)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                    onClick={onBack}
                    type="button"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.burgundy,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <ArrowLeft size={20} />
                </button>

                <span
                    style={{
                        fontFamily: 'Unbounded, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                        color: colors.burgundy,
                    }}
                >
                    {title}
                </span>
            </div>

            <div className="edit-topbar-actions" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                    onClick={onOpenPreview}
                    style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        background: `${colors.burgundy}15`,
                        border: `1.5px solid ${colors.burgundy}`,
                        color: colors.burgundy,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                    }}
                    className="mobile-preview-btn"
                    type="button"
                >
                    <Eye size={15} /> {tr('Көру', 'Просмотр')}
                </button>

                <button
                    onClick={onShare}
                    type="button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1.1rem',
                        borderRadius: '10px',
                        background: copied ? '#ecfdf5' : colors.surface,
                        border: `1.5px solid ${copied ? '#10b981' : colors.border}`,
                        color: copied ? '#065f46' : colors.burgundy,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                    }}
                >
                    {copied ? <Check size={15} /> : <Share2 size={15} />}
                    {copied ? tr('Көшірілді!', 'Скопировано!') : tr('Бөлісу', 'Поделиться')}
                </button>

                {canDelete && (
                    <button
                        onClick={onDelete}
                        type="button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.55rem 1rem',
                            borderRadius: '10px',
                            background: '#fef2f2',
                            border: '1.5px solid #fecdd3',
                            color: '#be123c',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Trash2 size={15} /> {tr('Жою', 'Удалить')}
                    </button>
                )}

                <button
                    onClick={onSave}
                    disabled={saving}
                    type="button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1.3rem',
                        borderRadius: '10px',
                        background: saved ? '#10b981' : colors.burgundy,
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1,
                        transition: 'background 0.3s',
                    }}
                >
                    {saved ? <Check size={15} /> : <Save size={15} />}
                    {saving
                        ? tr('Сақталуда...', 'Сохранение...')
                        : saved
                            ? tr('Сақталды!', 'Сохранено!')
                            : tr('Сақтау', 'Сохранить')}
                </button>
            </div>
        </header>
    );
};

export default EditorTopBar;