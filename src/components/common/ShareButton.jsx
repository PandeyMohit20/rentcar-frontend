import PropTypes from 'prop-types'
import { IconButton, Tooltip } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import { useToast } from '@/contexts/ToastContext'

/**
 * Share button using the Web Share API with copy-link fallback.
 */
function ShareButton({ title = 'Check this out', text = '', url, sx }) {
  const { showSuccess, showError } = useToast()
  const shareUrl = url ?? window.location.href

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        showSuccess('Link copied to clipboard.')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showError('Unable to share at the moment.')
      }
    }
  }

  return (
    <Tooltip title="Share">
      <IconButton onClick={handleShare} aria-label="Share" sx={sx}>
        <ShareIcon />
      </IconButton>
    </Tooltip>
  )
}

ShareButton.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string,
  sx: PropTypes.object,
}

export default ShareButton
