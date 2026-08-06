import PropTypes from 'prop-types'
import { Box, Typography, IconButton, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Saved address card.
 */
function AddressCard({ address = {}, onEdit, onDelete }) {
  return (
    <MaterialCard sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">{address.label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {address.line}, {address.city}, {address.state} {address.pincode}
          </Typography>
          {address.isDefault && (
            <Chip label="Default" size="small" color="primary" sx={{ mt: 1 }} />
          )}
        </Box>
        <Box>
          <IconButton aria-label="Edit address" size="small" onClick={() => onEdit?.(address)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Delete address"
            size="small"
            color="error"
            onClick={() => onDelete?.(address)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </MaterialCard>
  )
}

AddressCard.propTypes = {
  address: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

export default AddressCard
