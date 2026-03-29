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
    mountFrame,
    syncFrameConfig,
    trByLang,
} from './template-frame/runtime';

const Template2Frame = ({
    invite,
    inviteId = null,
    enableRsvp = false,
    style,
    className,
    lang = 'kk',
    mobileZoom = false,
    mode = 'edit',
    lockInteractions = false,
}) => {
    const iframeRef = useRef(null);
    const [html, setHtml] = useState('');
    const prevHashRef = useRef('');

    const getOptimalFallback = () => {
        const category = getCategoryFromTemplateId(invite?.template);
        return getDefaultTemplateId(category);
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
                    lockInteractions,
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
        lockInteractions,
        invite?.previewPhotoUrl,
        invite?.gallery,
        invite?.musicUrl,
        invite?.musicKey,
        invite?.musicSource,
    ]);

    const liveConfig = useMemo(() => buildConfig(invite || {}, lang), [invite, lang]);

    useEffect(() => {
        const iframe = iframeRef.current;
        syncFrameConfig(iframe, liveConfig, prevHashRef);
    }, [liveConfig]);

    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        mountFrame(iframe, liveConfig, prevHashRef);
    };

    if (!html) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: mobileZoom ? '70vh' : '100%',
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
