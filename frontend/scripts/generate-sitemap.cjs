const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toi.com.kz';

(async () => {
    const { localizedIndexableRoutes } = await import('../src/seo/routeManifest.js');
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    localizedIndexableRoutes.forEach((page) => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    const distPath = path.resolve(__dirname, '../dist/sitemap.xml');
    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');

    fs.writeFileSync(distPath, xml);
    fs.writeFileSync(publicPath, xml);

    console.log('Sitemap updated at:', distPath);
    console.log('Sitemap synced to:', publicPath);
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
