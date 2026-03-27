import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

const ProgramSection = ({
    Section,
    Field,
    isMobile,
    inputStyle,
    colors,
    program = [],
    onAddItem,
    onRemoveItem,
    onChangeItem,
}) => {
    const { t } = useLang();
    const tr = (kk, ru) => t(kk, ru);

    return (
        <Section title={tr('Бағдарлама', 'Программа')} isMobile={isMobile}>
            <Field label={tr('Той бағдарламасы', 'Программа мероприятия')}>
                <div style={{ display: 'grid', gap: '0.85rem' }}>
                    {program.map((item, index) => (
                        <div
                            key={`program-${index}`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '132px minmax(0, 1fr) minmax(0, 1fr) 44px',
                                gap: '0.6rem',
                                alignItems: 'center',
                            }}
                        >
                            <input
                                type="time"
                                value={item.time || ''}
                                onChange={(e) => onChangeItem(index, 'time', e.target.value)}
                                style={inputStyle}
                            />

                            <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => onChangeItem(index, 'title', e.target.value)}
                                placeholder={tr('Мысалы: Қонақтарды қарсы алу', 'Например: Сбор гостей')}
                                style={inputStyle}
                            />

                            <input
                                type="text"
                                value={item.desc || ''}
                                onChange={(e) => onChangeItem(index, 'desc', e.target.value)}
                                placeholder={tr('Мысалы: Тіркелу және сәлемдесу', 'Например: Регистрация и приветствие')}
                                style={inputStyle}
                            />

                            <button
                                type="button"
                                onClick={() => onRemoveItem(index)}
                                aria-label={tr('Бағдарлама тармағын жою', 'Удалить пункт программы')}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    justifySelf: isMobile ? 'start' : 'stretch',
                                    borderRadius: '12px',
                                    border: `1.5px solid ${colors.border}`,
                                    background: '#fff',
                                    color: '#b91c1c',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={onAddItem}
                        style={{
                            width: '100%',
                            minHeight: '44px',
                            borderRadius: '12px',
                            border: `1.5px dashed ${colors.border}`,
                            background: '#fff',
                            color: colors.burgundy,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Plus size={16} />
                        {tr('Бағдарлама пунктін қосу', 'Добавить пункт программы')}
                    </button>
                </div>

                <p style={{ fontSize: '0.78rem', color: colors.textMuted, marginTop: '0.5rem', lineHeight: 1.5 }}>
                    {tr(
                        'Бұл бөлім тек осындай блокты қолдайтын шаблондарда көрінеді.',
                        'Этот блок показывается только в шаблонах с поддержкой программы.'
                    )}
                </p>
            </Field>
        </Section>
    );
};

export default ProgramSection;
