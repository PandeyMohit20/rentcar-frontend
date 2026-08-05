import { Box, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import { pageStyles } from './styles'

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal information you provide directly, such as your name, email address, phone number, and driving licence details.',
      'Booking and transaction information, including rental dates, locations, and payment details.',
      'Usage data collected automatically, such as your IP address, browser type, and device information.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To provide and manage your car rental bookings and payments.',
      'To communicate with you about your bookings, account, and support requests.',
      'To improve our services, personalise your experience, and ensure platform security.',
    ],
  },
  {
    title: '3. Sharing Your Information',
    content: [
      'We do not sell your personal information to third parties.',
      'We may share information with service providers who help operate our platform, subject to confidentiality obligations.',
      'We may disclose information where required by law or to protect the rights and safety of our users.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We implement appropriate technical and organisational measures to protect your personal information.',
      'Access to personal data is restricted to authorised personnel only.',
    ],
  },
  {
    title: '5. Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal information.',
      'You may object to or restrict certain processing of your data.',
      'To exercise these rights, contact us at support@rentcar.com.',
    ],
  },
]

/**
 * Privacy Policy page.
 */
function PrivacyPolicyPage() {
  return (
    <>
      <Seo title="Privacy Policy" description="Read the RentCar privacy policy." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Privacy Policy
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

export default PrivacyPolicyPage
