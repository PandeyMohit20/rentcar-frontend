import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
export default function PolicyPage(){return <Container maxWidth="md" sx={{py:6}}><Typography component="h1" variant="h4" gutterBottom>Refund information</Typography><Typography sx={{mb:3}}>Refund records are shown in your booking details when available. Their status and amount come from the payment records. Customers cannot initiate refunds directly in this application. A cancellation or payment review does not mean a refund has been initiated. No settlement date is shown unless it is provided by the service.</Typography><Button component={Link} to={ROUTES.MY_BOOKINGS} variant="contained">My Bookings</Button></Container>}
