import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import CarCard from './CarCard'

/**
 * Vertical stacked list of car cards.
 */
function CarList({ cars }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {cars.map((car) => (
        <Box key={car.id}>
          <CarCard car={car} />
        </Box>
      ))}
    </Box>
  )
}

CarList.propTypes = {
  cars: PropTypes.array.isRequired,
}

export default CarList
