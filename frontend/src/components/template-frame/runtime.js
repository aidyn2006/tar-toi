import {
    buildConfig,
    getNormalizedTemplate,
    getTemplateMetaForInvite,
    isPairTemplate,
    normalizeUrl,
    pad2,
    parseNames,
    PALETTES,
    pickPalette,
    trByLang,
} from './buildConfig';
import {
    applyPalette,
    injectConfig,
    injectPhoto,
    injectTemplateData,
    localizeTemplate,
} from './injectTemplateData';
import {
    applyTemplateEnhancements,
    injectAutoplay,
} from './applyTemplateEnhancements';
import {
    injectLiveBridge,
    mountFrame,
    postFrameConfig,
    syncFrameConfig,
} from './bridge';
import {
    injectRsvp,
    injectRsvpApi,
} from './injectRsvp';
import {
    getCategoryFromTemplateId,
    resolveTemplateId,
} from '../../config/templates/templateRegistry';

export {
    applyPalette,
    applyTemplateEnhancements,
    buildConfig,
    getNormalizedTemplate,
    getTemplateMetaForInvite,
    injectAutoplay,
    injectConfig,
    injectLiveBridge,
    injectPhoto,
    injectRsvp,
    injectRsvpApi,
    injectTemplateData,
    isPairTemplate,
    localizeTemplate,
    mountFrame,
    normalizeUrl,
    pad2,
    parseNames,
    PALETTES,
    pickPalette,
    postFrameConfig,
    syncFrameConfig,
    trByLang,
};

export function buildTemplate2Html(
    invite,
    htmlSource,
    {
        enableRsvp = false,
        inviteId = null,
        lang = 'kk',
        mode = 'edit',
    } = {}
) {
    const palette = pickPalette(invite);
    const isViewMode = mode === 'view';
    const config = { ...buildConfig(invite || {}, lang), autoplay: isViewMode };
    const tplKey = resolveTemplateId(
        invite?.template,
        getCategoryFromTemplateId(invite?.template)
    );

    const skipPalette =
        tplKey === 'wedding/template4.html' ||
        (htmlSource && /NO_PALETTE/i.test(htmlSource));

    let html = htmlSource;

    if (!skipPalette) {
        html = applyPalette(html, palette);
    }

    html = injectTemplateData(html, config, {
        heroUrl: config.heroPhotoUrl,
    });

    if (enableRsvp) {
        html = injectRsvp(html, {
            inviteId,
            maxGuests: config.maxGuests,
            lang,
        });
    }

    html = applyTemplateEnhancements(html, { isViewMode });
    html = injectLiveBridge(html);
    html = localizeTemplate(html, lang);

    return html;
}
