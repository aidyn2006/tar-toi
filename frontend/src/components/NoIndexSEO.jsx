import SEO from './SEO';
import { useLang } from '../context/LanguageContext';
import { DEFAULT_LOCALE, LOCALE_META } from '../seo/publicRoutes';

const NoIndexSEO = ({
    title,
    description,
    robots = 'noindex,nofollow',
}) => {
    const { lang } = useLang();
    const locale = LOCALE_META[lang] || LOCALE_META[DEFAULT_LOCALE];

    return (
        <SEO
            title={title}
            description={description}
            canonical={null}
            locale={locale.ogLocale}
            robots={robots}
        />
    );
};

export default NoIndexSEO;
