import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppProviders, AppRoutes } from './App';
import { getInitialLangForPathname } from './seo/publicRoutes';

export function render(url, { initialLang } = {}) {
    const helmetContext = {};
    const resolvedInitialLang = initialLang ?? getInitialLangForPathname(url);
    const appHtml = renderToString(
        <AppProviders helmetContext={helmetContext} initialLang={resolvedInitialLang}>
            <StaticRouter location={url}>
                <AppRoutes />
            </StaticRouter>
        </AppProviders>
    );

    return {
        appHtml,
        helmet: helmetContext.helmet,
    };
}
