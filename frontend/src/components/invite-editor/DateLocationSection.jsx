import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

function getDatePart(eventDate) {
    return eventDate ? eventDate.slice(0, 10) : '';
}

function getTimePart(eventDate) {
    return eventDate ? eventDate.slice(11, 16) : '';
}

const DateLocationSection = ({
    Section,
    Field,
    isMobile,
    inputStyle,
    colors,
    data,
    onChangeField,
    onChangeEventDate,
    supportsMap,
}) => {
    const { t } = useLang();
    const tr = (kk, ru) => t(kk, ru);

    const dateValue = getDatePart(data.eventDate);
    const timeValue = getTimePart(data.eventDate);

    return (
        <Section title={tr('Күн және орын', 'Дата и место')} isMobile={isMobile} border={false}>
            <Field label={tr('Дата және уақыт', 'Дата и время')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Calendar
                            size={14}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: colors.burgundy,
                            }}
                        />
                        <input
                            type="date"
                            value={dateValue}
                            onChange={(e) => onChangeEventDate(e.target.value, timeValue)}
                            style={{ ...inputStyle, paddingLeft: '30px' }}
                        />
                    </div>

                    <input
                        type="time"
                        value={timeValue}
                        onChange={(e) => onChangeEventDate(dateValue, e.target.value)}
                        style={inputStyle}
                    />
                </div>
            </Field>

            <Field label={tr('Той өтетін орын', 'Место проведения')}>
                <div style={{ position: 'relative', marginBottom: supportsMap ? '0.6rem' : 0 }}>
                    <MapPin
                        size={14}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: colors.burgundy,
                        }}
                    />
                    <input
                        value={data.locationName}
                        onChange={onChangeField('locationName')}
                        placeholder={tr('Astana, Farhi Hall', 'Astana, Farhi Hall')}
                        style={{ ...inputStyle, paddingLeft: '30px' }}
                    />
                </div>

                {supportsMap && (
                    <input
                        value={data.locationUrl}
                        onChange={onChangeField('locationUrl')}
                        placeholder={tr('2GIS немесе Google Maps сілтемесі', 'Ссылка на 2GIS или Google Maps')}
                        style={inputStyle}
                    />
                )}
            </Field>
        </Section>
    );
};

export default DateLocationSection;
