import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

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
}) => {
    const dateValue = getDatePart(data.eventDate);
    const timeValue = getTimePart(data.eventDate);

    return (
        <Section title="Күн және орын" isMobile={isMobile} border={false}>
            <Field label="Дата және уақыт">
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

            <Field label="Той өтетін орын">
                <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
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
                        placeholder="Astana, Farhi Hall"
                        style={{ ...inputStyle, paddingLeft: '30px' }}
                    />
                </div>

                <input
                    value={data.locationUrl}
                    onChange={onChangeField('locationUrl')}
                    placeholder="2GIS немесе Google Maps сілтемесі"
                    style={inputStyle}
                />
            </Field>
        </Section>
    );
};

export default DateLocationSection;