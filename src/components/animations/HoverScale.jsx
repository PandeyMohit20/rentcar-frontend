import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Hover scale wrapper for interactive cards and media.
 */
function HoverScale({ scale = 1.03, children }) {
  return (
    <motion.div whileHover={{ scale }} transition={{ duration: 0.25 }} style={{ height: '100%' }}>
      {children}
    </motion.div>
  )
}

HoverScale.propTypes = {
  scale: PropTypes.number,
  children: PropTypes.node.isRequired,
}

export default HoverScale
