import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Fab, Zoom } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

/**
 * Floating back-to-top button that appears after scrolling.
 */
function BackToTop({ threshold = 400 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="small"
        aria-label="back to top"
        onClick={handleClick}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  )
}

BackToTop.propTypes = {
  threshold: PropTypes.number,
}

export default BackToTop
