import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { APP_NAME } from '@/constants/app'

/**
 * SEO component wrapping react-helmet-async.
 * Sets title, meta description, and Open Graph tags.
 */
function Seo({ title, description, keywords, image, canonical, children }) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {image && <meta property="og:image" content={image} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
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
  children: PropTypes.node,
}

export default Seo
