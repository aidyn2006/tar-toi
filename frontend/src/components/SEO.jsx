import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, keywords }) => {
    const siteTitle = 'Toiga Shaqyru';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = 'https://toi.com.kz';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Онлайн шақырту жасау сервисі — электронные приглашения на той'} />
            <link rel="canonical" href={fullCanonical} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
