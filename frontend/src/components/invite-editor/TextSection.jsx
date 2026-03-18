import React from 'react';

const TextSection = ({
    Section,
    Field,
    isMobile,
    inputStyle,
    data,
    supportsPairNames,
    onChangeField,
    onAdjustMaxGuests,
    onChangeMaxGuests,
    colors,
}) => {
    return (
        <Section title="Мәтін" isMobile={isMobile}>
            <div
                className="edit-names-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: supportsPairNames ? '1fr 1fr' : '1fr',
                    gap: '0.75rem',
                }}
            >
                <Field label="Тақырып 1">
                    <input
                        value={data.topic1}
                        onChange={onChangeField('topic1')}
                        placeholder="Аты"
                        style={inputStyle}
                    />
                </Field>

                {supportsPairNames && (
                    <Field label="Тақырып 2">
                        <input
                            value={data.topic2}
                            onChange={onChangeField('topic2')}
                            placeholder="Жұбайы"
                            style={inputStyle}
                        />
                    </Field>
                )}
            </div>

            <Field label="Сипаттама">
                <textarea
                    value={data.description}
                    onChange={onChangeField('description')}
                    placeholder="Құрметті ағайын-туыс, сізді тойымызға шақырамыз..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </Field>

            <Field label="Той иелері">
                <input
                    value={data.toiOwners}
                    onChange={onChangeField('toiOwners')}
                    placeholder="Сырымбетовтар әулеті"
                    style={inputStyle}
                />
            </Field>

            <Field label="Қонақтар саны лимиті (0 = шексіз)">
                <div
                    className="guest-counter"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                    <button
                        type="button"
                        className="gc-btn"
                        onClick={() => onAdjustMaxGuests(-1)}
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            border: `1.5px solid ${colors.border}`,
                            background: '#fff',
                            fontSize: '18px',
                            color: colors.burgundy,
                            cursor: 'pointer',
                            fontWeight: 700,
                            lineHeight: 1,
                        }}
                    >
                        −
                    </button>

                    <input
                        id="maxGuestsInput"
                        type="number"
                        min="0"
                        value={data.maxGuests}
                        onChange={onChangeMaxGuests}
                        placeholder="0"
                        style={{
                            ...inputStyle,
                            width: '120px',
                            textAlign: 'center',
                            margin: '0',
                        }}
                    />

                    <button
                        type="button"
                        className="gc-btn"
                        onClick={() => onAdjustMaxGuests(1)}
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            border: `1.5px solid ${colors.border}`,
                            background: '#fff',
                            fontSize: '18px',
                            color: colors.burgundy,
                            cursor: 'pointer',
                            fontWeight: 700,
                            lineHeight: 1,
                        }}
                    >
                        +
                    </button>
                </div>

                <p style={{ fontSize: '0.78rem', color: colors.textMuted, marginTop: '0.35rem' }}>
                    {data.maxGuests > 0
                        ? `Максимум ${data.maxGuests} қонақ. RSVP лимитке жеткенде жабылады.`
                        : '0 немесе бос қалдыру — лимит жоқ.'}
                </p>
            </Field>
        </Section>
    );
};

export default TextSection;