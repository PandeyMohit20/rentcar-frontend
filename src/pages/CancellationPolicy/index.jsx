import { Box, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import { pageStyles } from './styles'

const sections = [
  {
    title: '1. Free Cancellation Window',
    content: [
      'Bookings can be cancelled free of charge up to 48 hours before the scheduled pickup time.',
      'You can cancel directly from your account on the Booking History page.',
    ],
  },
  {
    title: '2. Partial Cancellation Fee',
    content: [
      'Cancellations made within 48 hours of pickup are subject to a cancellation fee equivalent to one day’s rental.',
      'The remaining amount will be refunded as per our refund policy.',
    ],
  },
  {
    title: '3. No-Show Policy',
    content: [
      'Failure to pick up the vehicle within the reserved window is treated as a no-show.',
      'No-show bookings are non-refundable.',
    ],
  },
  {
    title: '4. Modifications',
    content: [
      'You may modify your booking dates subject to availability and any applicable price difference.',
      'Modifications made within 24 hours of pickup may not be possible.',
    ],
  },
  {
    title: '5. RentCar-Initiated Cancellations',
    content: [
      'If RentCar cancels a booking due to vehicle unavailability or technical reasons, you will receive a full refund.',
      'We will also offer a suitable alternative or a discount on your next booking.',
    ],
  },
]

/**
 * Cancellation Policy page.
 */
function CancellationPolicyPage() {
  return (
    <>
      <Seo title="Cancellation Policy" description="Read the RentCar cancellation policy." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Cancellation Policy
        </Typography>
        <Typography variant="body2" sx={pageStyles.lastUpdated}>
          Last updated: January 2025
        </Typography>
        {sections.map((section, idx) => (
          <Box key={idx} sx={pageStyles.section}>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            <Box component="ul" sx={pageStyles.list}>
              {section.content.map((item, i) => (
                <Typography component="li" key={i} variant="body2" color="text.secondary" paragraph>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    </>
  )
}

export default CancellationPolicyPage
