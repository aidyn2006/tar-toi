const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toi.com.kz';
const PAGES = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/categories', priority: '0.9', changefreq: 'weekly' },
    { loc: '/faq', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/meretoi-shakyru', priority: '0.8', changefreq: 'weekly' },
];

const generateSitemap = () => {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    PAGES.forEach(page => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(publicPath, xml);
    console.log('✅ Sitemap updated at:', publicPath);
};

generateSitemap();
