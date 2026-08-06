import PropTypes from 'prop-types'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'

/**
 * Convenience alias for the shared breadcrumb navigation.
 */
function Breadcrumb({ items = [] }) {
  return <Breadcrumbs items={items} />
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
}

export default Breadcrumb
