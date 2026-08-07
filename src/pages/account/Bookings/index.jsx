import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { AccountPageShell, BookingTable } from '@/components/account'
import { useBookingsHistory } from '@/features/bookings'
import { BOOKING_STATUS_META } from '@/features/account'
import MaterialCard from '@/components/ui/MaterialCard'
import { ROUTES } from '@/constants/routes'

/**
 * My Bookings page — upcoming/completed/cancelled/refunded bookings.
 */
function BookingsPage() {
  const navigate = useNavigate()
  const { data: historyData, isLoading } = useBookingsHistory()
  const bookings = useMemo(() => historyData ?? [], [historyData])

  const filterByStatus = (status) => bookings.filter((b) => b.status === status)

  const renderSection = (title, status) => {
    const items = filterByStatus(status)
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {title}{' '}
          <Chip label={BOOKING_STATUS_META[status]?.label ?? status} size="small" sx={{ ml: 1 }} />
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No {title.toLowerCase()} bookings.
          </Typography>
        ) : (
          <BookingTable
            bookings={items}
            loading={isLoading}
            onRowClick={(row) => navigate(ROUTES.BOOKING_DETAILS_WITH_ID(row.id))}
          />
        )}
      </Box>
    )
  }

  return (
    <AccountPageShell title="My Bookings" description="View and manage your car bookings.">
      <MaterialCard sx={{ p: 3 }}>
        {renderSection('Upcoming', 'upcoming')}
        {renderSection('Completed', 'completed')}
        {renderSection('Cancelled', 'cancelled')}
        {renderSection('Refunded', 'refunded')}
      </MaterialCard>
    </AccountPageShell>
  )
}

export default BookingsPage
