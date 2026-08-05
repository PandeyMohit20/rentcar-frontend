import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Page-level transition wrapper for route changes.
 */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageTransition
