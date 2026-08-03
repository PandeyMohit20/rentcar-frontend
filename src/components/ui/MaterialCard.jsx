import PropTypes from 'prop-types'
import { Card } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Reusable card wrapper with optional motion animation.
 */
function MaterialCard({ children, elevation = 1, hoverable = false, ...props }) {
  const card = (
    <Card elevation={elevation} {...props}>
      {children}
    </Card>
  )

  if (hoverable) {
    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        {card}
      </motion.div>
    )
  }

  return card
}

MaterialCard.propTypes = {
  children: PropTypes.node.isRequired,
  elevation: PropTypes.number,
  hoverable: PropTypes.bool,
}

export default MaterialCard
