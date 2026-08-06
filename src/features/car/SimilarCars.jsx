import PropTypes from 'prop-types'
import { Box, Typography, Grid } from '@mui/material'
import CarCard from '@/features/listing/CarCard'

/**
 * Similar cars section rendered as a responsive grid.
 */
function SimilarCars({ cars = [], title = 'Similar Cars' }) {
  if (cars.length === 0) return null

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item key={car.id} xs={12} sm={6} md={4}>
            <CarCard car={car} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

SimilarCars.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
}

export default SimilarCars
