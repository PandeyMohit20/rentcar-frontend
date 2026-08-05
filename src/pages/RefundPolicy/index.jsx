import { Box, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import { pageStyles } from './styles'

const sections = [
  {
    title: '1. Refund Eligibility',
    content: [
      'Refunds are available for eligible cancellations and failed or erroneous payments.',
      'Eligibility depends on the booking type and the stage of the booking at the time of cancellation.',
    ],
  },
  {
    title: '2. Cancellation Refunds',
    content: [
      'Cancellations made more than 48 hours before the scheduled pickup are eligible for a full refund.',
      'Cancellations made within 48 hours may incur a partial cancellation fee.',
      'No-show bookings are not eligible for a refund.',
    ],
  },
  {
    title: '3. Processing Time',
    content: [
      'Approved refunds are processed within 5–7 business days.',
      'Refunds are returned to the original payment method used at the time of booking.',
    ],
  },
  {
    title: '4. Non-Refundable Charges',
    content: [
      'Certain fees, such as late return penalties and damage charges, are non-refundable.',
      'Membership subscription fees are non-refundable after activation.',
    ],
  },
  {
    title: '5. How to Request a Refund',
    content: [
      'Contact our support team via the Support page or email support@rentcar.com.',
      'Provide your booking reference number to expedite processing.',
    ],
  },
]

/**
 * Refund Policy page.
 */
function RefundPolicyPage() {
  return (
    <>
      <Seo title="Refund Policy" description="Read the RentCar refund policy." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Refund Policy
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

export default RefundPolicyPage
