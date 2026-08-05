import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MaterialCard from '@/components/ui/MaterialCard'
import HoverScale from '@/components/animations/HoverScale'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

/**
 * Category card used in category grids.
 */
function CategoryCard({ icon: Icon, title, description, to }) {
  const content = (
    <MaterialCard sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {Icon && (
          <Box
            sx={{ mb: 2, color: 'primary.main', bgcolor: 'primary.light', borderRadius: 3, p: 1.5 }}
          >
            <Icon sx={{ fontSize: 40 }} />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {to && (
          <Box
            component="span"
            sx={{
              mt: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            Explore <ArrowForwardIcon fontSize="small" />
          </Box>
        )}
      </Box>
    </MaterialCard>
  )

  const wrapped = to ? (
    <Link to={to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {content}
    </Link>
  ) : (
    content
  )

  return <HoverScale>{wrapped}</HoverScale>
}

CategoryCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  to: PropTypes.string,
}

export default CategoryCard
