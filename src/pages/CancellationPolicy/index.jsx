import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
export default function PolicyPage(){return <Container maxWidth="md" sx={{py:6}}><Typography component="h1" variant="h4" gutterBottom>Cancellation information</Typography><Typography sx={{mb:3}}>Open My Bookings and select a booking to see the cancellation action when eligible. You can add an optional reason before confirming. Eligibility is checked again when you submit. The updated booking status shows whether cancellation succeeded. Cancellation does not itself guarantee a refund.</Typography><Button component={Link} to={ROUTES.MY_BOOKINGS} variant="contained">My Bookings</Button></Container>}
