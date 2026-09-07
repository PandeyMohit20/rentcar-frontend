import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
export default function PaymentPage() { return <Navigate to={ROUTES.MY_BOOKINGS} replace /> }
