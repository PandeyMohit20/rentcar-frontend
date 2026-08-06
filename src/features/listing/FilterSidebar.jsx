import PropTypes from 'prop-types'
import { Box, Divider, Button } from '@mui/material'
import PriceSlider from './PriceSlider'
import BrandFilter from './BrandFilter'
import CategoryFilter from './CategoryFilter'
import TransmissionFilter from './TransmissionFilter'
import FuelTypeFilter from './FuelTypeFilter'
import SeatsFilter from './SeatsFilter'
import RatingFilter from './RatingFilter'
import AmenityFilter from './AmenityFilter'
import { DEFAULT_PRICE_RANGE } from '@/constants/carFilters'

/**
 * Composite filter sidebar for search results.
 */
function FilterSidebar({ filters = {}, onChange, onClear }) {
  const update = (key) => (val) => onChange && onChange({ ...filters, [key]: val })

  return (
    <Box>
      <PriceSlider
        value={filters.priceRange ?? DEFAULT_PRICE_RANGE}
        onChange={update('priceRange')}
      />
      <Divider sx={{ my: 2 }} />
      <BrandFilter value={filters.brands ?? []} onChange={update('brands')} />
      <Divider sx={{ my: 2 }} />
      <CategoryFilter value={filters.categories ?? []} onChange={update('categories')} />
      <Divider sx={{ my: 2 }} />
      <TransmissionFilter value={filters.transmissions ?? []} onChange={update('transmissions')} />
      <Divider sx={{ my: 2 }} />
      <FuelTypeFilter value={filters.fuelTypes ?? []} onChange={update('fuelTypes')} />
      <Divider sx={{ my: 2 }} />
      <SeatsFilter value={filters.seats ?? []} onChange={update('seats')} />
      <Divider sx={{ my: 2 }} />
      <RatingFilter value={filters.minRating ?? 0} onChange={update('minRating')} />
      <Divider sx={{ my: 2 }} />
      <AmenityFilter value={filters.amenities ?? []} onChange={update('amenities')} />
      <Box sx={{ mt: 3 }}>
        <Button fullWidth variant="outlined" color="inherit" onClick={onClear}>
          Clear Filters
        </Button>
      </Box>
    </Box>
  )
}

FilterSidebar.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
}

export default FilterSidebar
