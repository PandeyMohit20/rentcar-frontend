import PropTypes from 'prop-types'
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import MaterialCard from '@/components/ui/MaterialCard'
import HoverScale from '@/components/animations/HoverScale'

/**
 * Membership plan card.
 */
function MembershipCard({ plan, featured = false, onSelect }) {
  return (
    <HoverScale>
      <MaterialCard
        sx={{
          height: '100%',
          position: 'relative',
          border: featured ? 2 : 1,
          borderColor: featured ? 'primary.main' : 'divider',
          boxShadow: featured ? 6 : 1,
        }}
      >
        {featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: -8,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Popular
          </Box>
        )}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {plan.name}
          </Typography>
          <Typography component="div" variant="h4" color="primary" sx={{ fontWeight: 800 }}>
            {plan.price}
            <Typography component="span" variant="caption" color="text.secondary">
              {' '}
              / {plan.period}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {plan.description}
          </Typography>
          <List dense>
            {plan.features.map((feature) => (
              <ListItem key={feature} disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
          <Button
            variant={featured ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
            onClick={() => onSelect && onSelect(plan)}
            sx={{ mt: 2 }}
          >
            Choose Plan
          </Button>
        </Box>
      </MaterialCard>
    </HoverScale>
  )
}

MembershipCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.string,
    period: PropTypes.string,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
  }),
  featured: PropTypes.bool,
  onSelect: PropTypes.func,
}

export default MembershipCard
