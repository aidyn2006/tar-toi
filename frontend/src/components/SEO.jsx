import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, keywords, image, schemaData }) => {
    const siteTitle = 'Toiga Shaqyru';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = 'https://toi.com.kz';
    const fullCanonical = canonical ? `${siteUrl}/${canonical.replace(/^\//, '')}`.replace(/\/$/, '') : siteUrl;
    const shareImage = image ? `${siteUrl}${image}` : `${siteUrl}/logo.png`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Онлайн шақырту жасау сервисі — электронные приглашения на той'} />
            <link rel="canonical" href={fullCanonical} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content="index, follow" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:image" content={shareImage} />
            <meta property="og:site_name" content="Toiga Shaqyru" />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={shareImage} />

            {/* JSON-LD Structured Data */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
