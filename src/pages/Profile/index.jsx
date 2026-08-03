import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Profile page — user account and preferences.
 */
function ProfilePage() {
  return (
    <>
      <Seo title="Profile" description="Manage your profile, preferences and documents." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Profile functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default ProfilePage
