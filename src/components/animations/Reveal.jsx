import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Generic scroll-reveal wrapper with configurable direction/delay.
 */
const variants = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideUp: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  slideDown: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
}

function Reveal({ direction = 'slideUp', delay = 0, duration = 0.5, once = true, children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      variants={variants[direction] ?? variants.slideUp}
    >
      {children}
    </motion.div>
  )
}

Reveal.propTypes = {
  direction: PropTypes.oneOf(['fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoom']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  once: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Reveal
