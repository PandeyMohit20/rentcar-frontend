import { Box, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import { pageStyles } from './styles'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the RentCar platform, you agree to be bound by these Terms and Conditions.',
      'If you do not agree with any part of these terms, you may not use our services.',
    ],
  },
  {
    title: '2. Eligibility',
    content: [
      'You must be at least 21 years old and hold a valid driving licence to rent a car.',
      'You must provide accurate and complete information when creating an account.',
    ],
  },
  {
    title: '3. Bookings and Payments',
    content: [
      'All bookings are subject to availability and confirmation.',
      'Payment must be made at the time of booking unless otherwise specified.',
      'Prices are subject to change based on demand, duration, and applicable taxes.',
    ],
  },
  {
    title: '4. Cancellations and Refunds',
    content: [
      'Cancellation policies vary by booking and are displayed at the time of booking.',
      'Refunds are processed to the original payment method within the stated timeframe.',
    ],
  },
  {
    title: '5. User Responsibilities',
    content: [
      'You are responsible for the safe and lawful use of the rented vehicle.',
      'You must return the vehicle in the same condition and on the agreed date.',
      'You are liable for any damage or loss not covered by the included coverage.',
    ],
  },
  {
    title: '6. Limitation of Liability',
    content: [
      'RentCar is not liable for indirect, incidental, or consequential damages arising from your use of the service.',
      'Our total liability is limited to the amount you paid for the specific booking.',
    ],
  },
]

/**
 * Terms & Conditions page.
 */
function TermsConditionsPage() {
  return (
    <>
      <Seo title="Terms & Conditions" description="Read the RentCar terms and conditions." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Terms &amp; Conditions
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

export default TermsConditionsPage
