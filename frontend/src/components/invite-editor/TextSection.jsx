import React from 'react';
import { useLang } from '../../context/LanguageContext';

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
    const { t } = useLang();
    const tr = (kk, ru) => t(kk, ru);

    return (
        <Section title={tr('Мәтін', 'Текст')} isMobile={isMobile}>
            <div
                className="edit-names-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: supportsPairNames ? '1fr 1fr' : '1fr',
                    gap: '0.75rem',
                }}
            >
                <Field label={tr('Тақырып 1', 'Имя 1')}>
                    <input
                        value={data.topic1}
                        onChange={onChangeField('topic1')}
                        placeholder={tr('Аты', 'Имя')}
                        style={inputStyle}
                    />
                </Field>

                {supportsPairNames && (
                    <Field label={tr('Тақырып 2', 'Имя 2')}>
                        <input
                            value={data.topic2}
                            onChange={onChangeField('topic2')}
                            placeholder={tr('Жұбайы', 'Пара')}
                            style={inputStyle}
                        />
                    </Field>
                )}
            </div>

            <Field label={tr('Сипаттама', 'Описание')}>
                <textarea
                    value={data.description}
                    onChange={onChangeField('description')}
                    placeholder={tr(
                        'Құрметті ағайын-туыс, сізді тойымызға шақырамыз...',
                        'Дорогие родные и близкие, приглашаем вас на наше торжество...'
                    )}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </Field>

            <Field label={tr('Той иелері', 'Хозяева торжества')}>
                <input
                    value={data.toiOwners}
                    onChange={onChangeField('toiOwners')}
                    placeholder={tr('Сырымбетовтар әулеті', 'Семья Сырымбетовых')}
                    style={inputStyle}
                />
            </Field>

            <Field label={tr('Қонақтар саны лимиті (0 = шексіз)', 'Лимит гостей (0 = без лимита)')}>
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
                        ? tr(
                            `Максимум ${data.maxGuests} қонақ. RSVP лимитке жеткенде жабылады.`,
                            `Максимум ${data.maxGuests} гостей. RSVP закроется, когда лимит будет достигнут.`
                        )
                        : tr('0 немесе бос қалдыру — лимит жоқ.', '0 или пустое значение — без лимита.')}
                </p>
            </Field>
        </Section>
    );
};

export default TextSection;