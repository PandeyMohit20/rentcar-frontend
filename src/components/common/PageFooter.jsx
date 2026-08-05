import PropTypes from 'prop-types'
import Footer from '@/components/navigation/Footer'

/**
 * Page footer wrapper. Extends the shared Footer with additional link groups.
 */
function PageFooter({ links = [], secondaryLinks = [] }) {
  return <Footer links={links} secondaryLinks={secondaryLinks} />
}

PageFooter.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string.isRequired })
  ),
  secondaryLinks: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string.isRequired })
  ),
}

export default PageFooter
