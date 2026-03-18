import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
    getTemplateLoader,
    resolveTemplateId,
    getDefaultTemplateId,
    getCategoryFromTemplateId,
} from '../config/templates/templateRegistry';
import {
    buildConfig,
    buildTemplate2Html,
    trByLang,
} from './template-frame/runtime';

function isInviteEmpty(invite) {
    if (!invite) return true;

    const hasMain =
        (invite.title && invite.title.trim()) ||
        (invite.topic1 && invite.topic1.trim()) ||
        (invite.topic2 && invite.topic2.trim()) ||
        (invite.description && invite.description.trim()) ||
        invite.eventDate ||
        (invite.previewPhotoUrl && invite.previewPhotoUrl.trim()) ||
        (Array.isArray(invite.gallery) && invite.gallery.length > 0);

    return !hasMain;
}

const Template2Frame = ({
    invite,
    inviteId = null,
    enableRsvp = false,
    style,
    className,
    lang = 'kk',
    mobileZoom = false,
    mode = 'edit',
}) => {
    const iframeRef = useRef(null);
    const [html, setHtml] = useState('');
    const prevHashRef = useRef('');

    const getOptimalFallback = () => {
        const category = getCategoryFromTemplateId(invite?.template);
        return getDefaultTemplateId(category || 'common');
    };

    useEffect(() => {
        const nextKey = resolveTemplateId(
            invite?.template,
            getCategoryFromTemplateId(invite?.template)
        );

        let active = true;

        const load = async () => {
            const loader =
                getTemplateLoader(nextKey) ||
                getTemplateLoader(getOptimalFallback());

            if (!loader) return;

            try {
                const raw = await loader();
                if (!active) return;

                const fullHtml = buildTemplate2Html(invite, raw, {
                    enableRsvp,
                    inviteId,
                    lang,
                    mode,
                });

                setHtml(fullHtml);
            } catch (err) {
                console.error('Template load failed:', err);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [
        invite?.template,
        enableRsvp,
        inviteId,
        lang,
        mode,
        invite?.previewPhotoUrl,
        invite?.gallery,
        invite?.musicUrl,
        invite?.musicKey,
        invite?.musicSource,
    ]);

    const emptyInvite = useMemo(() => isInviteEmpty(invite), [invite]);
    const liveConfig = useMemo(() => buildConfig(invite || {}, lang), [invite, lang]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;

        const hash = JSON.stringify(liveConfig);
        if (hash === prevHashRef.current) return;

        prevHashRef.current = hash;
        iframe.contentWindow.postMessage(
            { type: 'UPDATE_CONFIG', config: liveConfig },
            '*'
        );
    }, [liveConfig]);

    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return;

        prevHashRef.current = '';
        iframe.contentWindow.postMessage(
            { type: 'UPDATE_CONFIG', config: liveConfig },
            '*'
        );
    };

    if (mode === 'edit' && emptyInvite) {
        return (
            <div
                className={className}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: mobileZoom ? '70vh' : '100%',
                    borderRadius: '16px',
                    border: '1px dashed #d7e9df',
                    background: '#f7fff9',
                    color: '#173f33',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '28px',
                    boxSizing: 'border-box',
                    ...style,
                }}
            >
                <div style={{ maxWidth: '360px', lineHeight: 1.4, fontFamily: 'Manrope, sans-serif' }}>
                    <div style={{ fontWeight: 800, marginBottom: '6px' }}>
                        {trByLang(lang, 'Алдын ала қарау', 'Предпросмотр')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#5f7f73' }}>
                        {trByLang(
                            lang,
                            'Шаблон осы жерде көрсетіледі. Фото, атаулар немесе күнді қосыңыз — превью бірден жаңартылады.',
                            'Шаблон появится здесь. Добавьте фото, имена или дату — предпросмотр обновится сразу.'
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!html && !emptyInvite) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#F8FFFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    fontFamily: 'Manrope, sans-serif',
                }}
            >
                {trByLang(lang, 'Жүктелуде...', 'Загрузка...')}
            </div>
        );
    }

    return (
        <iframe
            ref={iframeRef}
            title="template-2-preview"
            srcDoc={html}
            onLoad={handleIframeLoad}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                minHeight: mobileZoom ? '70vh' : '100%',
                border: 'none',
                background: 'transparent',
                transform: mobileZoom ? 'scale(1.05)' : 'none',
                transformOrigin: 'top center',
                ...style,
            }}
        />
    );
};

export default Template2Frame;