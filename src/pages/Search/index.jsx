import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container, Typography, Grid, Button, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import MaterialCard from '@/components/ui/MaterialCard'
import CarCard from '@/components/cards/CarCard'
import EmptyState from '@/components/common/EmptyState'
import { carSearchSchema } from '@/validators/carValidator'
import { carService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { CarFuelType, CarTransmission } from '@/types'
import { pageStyles } from './styles'

const fuelOptions = Object.values(CarFuelType).map((value) => ({ value, label: value }))
const transmissionOptions = Object.values(CarTransmission).map((value) => ({
  value,
  label: value,
}))

/**
 * Search Cars page — search, filter and browse available cars.
 */
function SearchPage() {
  const [queryParams, setQueryParams] = useState({})

  const methods = useForm({
    resolver: zodResolver(carSearchSchema),
    defaultValues: {
      location: '',
      pickupDate: '',
      dropDate: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      seatingCapacity: '',
    },
  })

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.SEARCH(queryParams),
    queryFn: () => carService.searchCars(queryParams),
    enabled: Object.keys(queryParams).length > 0,
  })

  const results = data?.data ?? data?.cars ?? []

  const onSubmit = (values) => {
    const params = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v != null)
    )
    setQueryParams(params)
  }

  return (
    <>
      <Seo
        title="Search Cars"
        description="Search available cars by location, dates and filters."
      />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Search Cars
        </Typography>

        <MaterialCard sx={pageStyles.formCard}>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField name="location" label="Location" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField
                    name="pickupDate"
                    label="Pickup Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField
                    name="dropDate"
                    label="Drop Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField name="minPrice" label="Min Price (₹)" type="number" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField name="maxPrice" label="Max Price (₹)" type="number" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SelectField name="fuelType" label="Fuel Type" options={fuelOptions} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <SelectField
                    name="transmission"
                    label="Transmission"
                    options={transmissionOptions}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputField name="seatingCapacity" label="Seats" type="number" />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </MaterialCard>

        <Typography variant="h5" gutterBottom sx={pageStyles.resultsTitle}>
          {Object.keys(queryParams).length > 0 ? 'Results' : 'Browse Cars'}
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState
            title="Unable to load cars"
            description="We couldn't fetch cars right now. Please try again."
          />
        ) : results.length === 0 ? (
          <EmptyState title="No cars found" description="Try adjusting your search filters." />
        ) : (
          <Grid container spacing={3}>
            {results.map((car) => (
              <Grid item key={car.id} xs={12} sm={6} md={4}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}

export default SearchPage
