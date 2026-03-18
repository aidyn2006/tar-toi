import React from 'react';

const TemplateSelectorSection = ({
    isMobile,
    Section,
    Field,
    selectableTemplates,
    templateValue,
    onSelectTemplate,
    colors,
}) => {
    return (
        <Section title="Шаблон" isMobile={isMobile}>
            <Field label="Файл шаблона">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
                    {selectableTemplates.map((opt) => {
                        const active = templateValue === opt.id;
                        const pretty = opt.label.trim() || 'Template';
                        const [cat, file] = opt.id.split('/');
                        const subtitle = `${cat || 'template'} / ${file?.replace('.html', '') || ''}`;

                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => onSelectTemplate(opt.id)}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    border: `1.5px solid ${active ? colors.burgundy : colors.border}`,
                                    background: active ? `${colors.burgundy}10` : '#fff',
                                    cursor: 'pointer',
                                    boxShadow: active ? '0 8px 20px rgba(23,63,51,0.12)' : 'none',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '90px',
                                        borderRadius: '10px',
                                        background: `${colors.burgundy}0f`,
                                        border: `1px solid ${colors.border}`,
                                        marginBottom: '0.55rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {opt.preview ? (
                                        <img
                                            src={opt.preview}
                                            alt={pretty}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'grid',
                                                placeItems: 'center',
                                                color: colors.textMuted,
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {pretty}
                                        </div>
                                    )}

                                    {opt.isPremium && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                background: 'rgba(255,255,255,0.92)',
                                                color: colors.burgundy,
                                                padding: '0.2rem 0.45rem',
                                                borderRadius: '999px',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                            }}
                                        >
                                            Premium
                                        </span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        fontWeight: 700,
                                        color: colors.burgundy,
                                        fontSize: '0.9rem',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {pretty}
                                </div>

                                <div style={{ color: colors.textMuted, fontSize: '0.78rem', marginTop: '0.1rem' }}>
                                    {subtitle}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Field>
        </Section>
    );
};

export default TemplateSelectorSection;