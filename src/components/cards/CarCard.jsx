import { Box, Typography, Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined'
import AirlineSeatReclineNormalRoundedIcon from '@mui/icons-material/AirlineSeatReclineNormalRounded'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'
import ImageLazy from '@/components/common/ImageLazy'

export default function CarCard({ car, to, availabilityChecked = false }) {
  return (
    <MaterialCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 8px 24px rgba(16,35,32,.08)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ImageLazy src={car.primaryImageUrl} alt={`${car.brand} ${car.model}`} ratio="16/10" />
        {availabilityChecked && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              py: 0.5,
              px: 1,
              borderRadius: 0.5,
              bgcolor: 'background.paper',
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            Available for your dates
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 2.5, flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {[car.brand, car.year].filter(Boolean).join(' / ')}
        </Typography>
        <Typography component="h3" variant="h5" sx={{ overflowWrap: 'anywhere', mt: 0.5, mb: 2 }}>
          {car.brand} {car.model}
        </Typography>
        <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 2 }}>
          {[
            [SettingsOutlinedIcon, car.transmission],
            [LocalGasStationOutlinedIcon, car.fuelType],
            [
              AirlineSeatReclineNormalRoundedIcon,
              car.seatingCapacity ? `${car.seatingCapacity} seats` : null,
            ],
          ]
            .filter(([, value]) => value)
            .map(([Icon, value]) => (
              <Stack key={value} direction="row" alignItems="center" spacing={0.5}>
                <Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                  {value}
                </Typography>
              </Stack>
            ))}
        </Stack>
        {car.branch?.name && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
            {car.branch.name}
          </Typography>
        )}
        {car.features?.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {car.features
              .slice(0, 3)
              .map((feature) => feature.name)
              .join(' / ')}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          mx: 2.5,
          py: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography fontWeight={800}>
            {car.dailyPrice == null
              ? 'Request a quote'
              : formatCurrency(car.dailyPrice, car.currencyCode)}
            {car.dailyPrice != null && (
              <Typography component="span" variant="caption" color="text.secondary">
                {' '}
                / day
              </Typography>
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {car.dailyPrice == null ? 'For your selected trip' : 'Final total in your quote'}
          </Typography>
        </Box>
        <Button
          component={Link}
          to={to || ROUTES.CAR_DETAILS_WITH_ID(car.id)}
          variant="outlined"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
          aria-label={`View ${car.brand} ${car.model} details`}
          sx={{ px: 1.5 }}
        >
          View Details
        </Button>
      </Box>
    </MaterialCard>
  )
}
