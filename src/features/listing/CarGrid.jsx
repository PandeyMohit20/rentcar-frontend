import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import CarCard from './CarCard'

/**
 * Responsive grid layout of car cards.
 */
function CarGrid({ cars }) {
  return (
    <Grid container spacing={3}>
      {cars.map((car) => (
        <Grid item key={car.id} xs={12} sm={6} md={4}>
          <CarCard car={car} />
        </Grid>
      ))}
    </Grid>
  )
}

CarGrid.propTypes = {
  cars: PropTypes.array.isRequired,
}

export default CarGrid
