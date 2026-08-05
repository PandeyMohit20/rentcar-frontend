import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { APP_NAME, APP_DEFAULT_LANGUAGE } from '@/constants/app'

/**
 * SEO component wrapping react-helmet-async.
 * Sets title, meta description, Open Graph and Twitter card tags.
 */
function Seo({
  title,
  description,
  keywords,
  image,
  canonical,
  type = 'website',
  twitterCard = 'summary_large_image',
  children,
}) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME

  return (
    <Helmet>
      {/* Title */}
      <title>{fullTitle}</title>
      <meta property="og:site_name" content={APP_NAME} />

      {/* Basic meta */}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <html lang={APP_DEFAULT_LANGUAGE} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {children}
    </Helmet>
  )
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  canonical: PropTypes.string,
  type: PropTypes.string,
  twitterCard: PropTypes.string,
  children: PropTypes.node,
}

export default Seo
