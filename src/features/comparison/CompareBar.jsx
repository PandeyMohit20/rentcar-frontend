import PropTypes from 'prop-types'
import { Box, Chip, Stack, Typography, Button } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import CloseIcon from '@mui/icons-material/Close'
import { Link } from 'react-router-dom'
import { useComparison } from './useComparison'
import { ROUTES } from '@/constants/routes'

/**
 * Floating bottom bar revealing the current comparison set.
 * Only renders when at least one car is selected.
 */
function CompareBar({ names = {}, onView }) {
  const { carIds, remove, clear, comparisonLimit } = useComparison()

  if (carIds.length === 0) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        bgcolor: 'background.paper',
        boxShadow: 6,
        borderRadius: 2,
        px: 2,
        py: 1.5,
        maxWidth: '90vw',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        <CompareArrowsIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2">
          {carIds.length} / {comparisonLimit} selected
        </Typography>
        {carIds.map((id) => (
          <Chip
            key={id}
            label={names?.[id] ?? id}
            size="small"
            onDelete={() => remove(id)}
            deleteIcon={<CloseIcon />}
          />
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={clear} color="inherit">
          Clear
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          component={Link}
          to={ROUTES.COMPARE}
          onClick={onView}
          disabled={carIds.length < 2}
        >
          Compare
        </Button>
      </Stack>
    </Box>
  )
}

CompareBar.propTypes = {
  names: PropTypes.object,
  onView: PropTypes.func,
}

export default CompareBar
