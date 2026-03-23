import React from 'react';
import { UploadCloud, Image, Music, Trash2 } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';

const MediaSection = ({
    Section,
    Field,
    isMobile,
    colors,
    inputStyle,
    data,
    uploadingPhoto,
    uploadingGallery,
    uploadingAudio,
    normalizeUrl,
    onMainPhotoUpload,
    onClearMainPhoto,
    onGalleryUpload,
    onRemoveGalleryPhoto,
    musicSource,
    onSwitchMusicSource,
    onClearMusic,
    systemMusic,
    systemMusicMap,
    onSelectSystemMusic,
    onAudioUpload,
    supportsGallery,
    supportsMusic,
}) => {
    const { t } = useLang();
    const tr = (kk, ru) => t(kk, ru);

    return (
        <Section title={tr('Медиа', 'Медиа')} isMobile={isMobile}>
            <Field label={tr('Басты фото', 'Главное фото')}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.65rem 1rem',
                            borderRadius: '10px',
                            border: `1.5px dashed ${colors.border}`,
                            cursor: 'pointer',
                            background: '#fff',
                            color: colors.burgundy,
                            fontWeight: 700,
                        }}
                    >
                        <UploadCloud size={16} />
                        {uploadingPhoto ? tr('Жүктелуде...', 'Загрузка...') : tr('Жүктеу', 'Загрузить')}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files?.[0]) onMainPhotoUpload(e.target.files[0]);
                                e.target.value = '';
                            }}
                        />
                    </label>

                    {data.previewPhotoUrl && (
                        <div style={{ position: 'relative' }}>
                            <img
                                src={normalizeUrl(data.previewPhotoUrl)}
                                alt={tr('Басты фото', 'Главное фото')}
                                style={{
                                    width: '110px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: `1px solid ${colors.border}`,
                                }}
                            />
                            <button
                                onClick={onClearMainPhoto}
                                type="button"
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    border: 'none',
                                    background: 'rgba(0,0,0,0.45)',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    cursor: 'pointer',
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>
            </Field>
                    {supportsGallery && (
            <Field label={tr('Галерея фотолары', 'Фотогалерея')}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.65rem 1rem',
                            borderRadius: '10px',
                            border: `1.5px dashed ${colors.border}`,
                            cursor: 'pointer',
                            background: '#fff',
                            color: colors.burgundy,
                            fontWeight: 700,
                        }}
                    >
                        <Image size={16} />
                        {uploadingGallery ? tr('Жүктелуде...', 'Загрузка...') : tr('Файлдарды қосу', 'Добавить файлы')}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files?.length) onGalleryUpload(e.target.files);
                                e.target.value = '';
                            }}
                        />
                    </label>
                    <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
                        {tr('Кемінде 1-2 фото қосыңыз', 'Добавьте хотя бы 1–2 фото')}
                    </span>
                </div>

                {(data.gallery?.length || 0) > 0 && (
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {data.gallery.map((urlRaw) => {
                            const url = normalizeUrl(urlRaw);
                            return (
                                <div key={url} style={{ position: 'relative' }}>
                                    <img
                                        src={url}
                                        alt={tr('Фото', 'Фото')}
                                        style={{
                                            width: '90px',
                                            height: '70px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            border: `1px solid ${colors.border}`,
                                        }}
                                    />
                                    <button
                                        onClick={() => onRemoveGalleryPhoto(urlRaw)}
                                        type="button"
                                        style={{
                                            position: 'absolute',
                                            top: 3,
                                            right: 3,
                                            border: 'none',
                                            background: 'rgba(0,0,0,0.5)',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Field>
)}
            {supportsMusic && (
            <Field label={tr('Музыка (қаласаңыз)', 'Музыка (необязательно)')}>
                <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                    <button
                        type="button"
                        onClick={() => onSwitchMusicSource(musicSource.SYSTEM)}
                        style={{
                            padding: '0.55rem 0.9rem',
                            borderRadius: '10px',
                            border: `1.5px solid ${data.musicSource === musicSource.SYSTEM ? colors.burgundy : colors.border}`,
                            background: data.musicSource === musicSource.SYSTEM ? `${colors.burgundy}12` : '#fff',
                            color: colors.burgundy,
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        {tr('Системалық', 'Системная')}
                    </button>

                    <button
                        type="button"
                        onClick={() => onSwitchMusicSource(musicSource.UPLOAD)}
                        style={{
                            padding: '0.55rem 0.9rem',
                            borderRadius: '10px',
                            border: `1.5px solid ${data.musicSource === musicSource.UPLOAD ? colors.burgundy : colors.border}`,
                            background: data.musicSource === musicSource.UPLOAD ? `${colors.burgundy}12` : '#fff',
                            color: colors.burgundy,
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        {tr('Өз файлым', 'Свой файл')}
                    </button>

                    <button
                        type="button"
                        onClick={onClearMusic}
                        style={{
                            padding: '0.55rem 0.9rem',
                            borderRadius: '10px',
                            border: `1.5px solid ${colors.border}`,
                            background: '#fff',
                            color: colors.textMuted,
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        {tr('Музыкасыз', 'Без музыки')}
                    </button>
                </div>

                {data.musicSource === musicSource.SYSTEM && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <select
                            value={data.musicKey || ''}
                            onChange={(e) => onSelectSystemMusic(e.target.value)}
                            style={{ ...inputStyle, width: '260px', maxWidth: '100%', padding: '0.65rem 0.75rem' }}
                        >
                            <option value="">{tr('Тректі таңдаңыз', 'Выберите трек')}</option>
                            {systemMusic.map((track) => (
                                <option key={track.key} value={track.key}>
                                    {track.title}
                                </option>
                            ))}
                        </select>

                        {data.musicKey && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: '#fff',
                                    border: `1px solid ${colors.border}`,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '10px',
                                }}
                            >
                                <Music size={16} color={colors.burgundy} />
                                <span style={{ fontWeight: 700, color: colors.burgundy }}>
                                    {systemMusicMap[data.musicKey]?.title || tr('Трек', 'Трек')}
                                </span>
                                <button
                                    onClick={onClearMusic}
                                    type="button"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: colors.textMuted,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tr('Өшіру', 'Удалить')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {data.musicSource === musicSource.UPLOAD && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <label
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.65rem 1rem',
                                borderRadius: '10px',
                                border: `1.5px dashed ${colors.border}`,
                                cursor: 'pointer',
                                background: '#fff',
                                color: colors.burgundy,
                                fontWeight: 700,
                            }}
                        >
                            <Music size={16} />
                            {uploadingAudio ? tr('Жүктелуде...', 'Загрузка...') : tr('MP3 жүктеу', 'Загрузить MP3')}
                            <input
                                type="file"
                                accept="audio/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (e.target.files?.[0]) onAudioUpload(e.target.files[0]);
                                    e.target.value = '';
                                }}
                            />
                        </label>

                        {data.musicUrl && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '10px',
                                    background: '#fff',
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <Music size={16} color={colors.burgundy} />
                                <span style={{ fontWeight: 700, color: colors.burgundy }}>
                                    {data.musicTitle || tr('Аудио файл', 'Аудиофайл')}
                                </span>
                                <button
                                    onClick={onClearMusic}
                                    type="button"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: colors.textMuted,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tr('Өшіру', 'Удалить')}
                                </button>
                            </div>
                        )}

                        {!data.musicUrl && (
                            <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
                                {tr('MP3/OGG жүктеп, автоматты түрде сақтаңыз.', 'Загрузите MP3/OGG, и файл сохранится автоматически.')}
                            </span>
                        )}
                    </div>
                )}

                {data.musicSource === musicSource.NONE && (
                    <div style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
                        {tr('Музыка қосылмаған.', 'Музыка не добавлена.')}
                    </div>
                )}

                <p style={{ fontSize: '0.82rem', color: colors.textMuted, marginTop: '0.4rem' }}>
                    {tr(
                        'Музыка мен автоскролл тек алдын ала қарауда ойнайды. Редакторда өшірілген.',
                        'Музыка и автоскролл работают только в предпросмотре. В редакторе они отключены.'
                    )}
                </p>
            </Field>)}
        </Section>
    );
};

export default MediaSection;