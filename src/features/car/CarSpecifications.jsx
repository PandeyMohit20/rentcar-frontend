import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'

/**
 * Car specifications table.
 */
function CarSpecifications({ specifications = {} }) {
  const entries = Object.entries(specifications ?? {})

  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No specifications available.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Specifications
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ textTransform: 'capitalize', fontWeight: 600 }}>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

CarSpecifications.propTypes = {
  specifications: PropTypes.object,
}

export default CarSpecifications
