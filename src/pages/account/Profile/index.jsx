import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Box, Typography, Divider } from '@mui/material'
import { AccountPageShell, ProfileCard, UserAvatar } from '@/components/account'
import { useProfile, useEmergencyContact, useProfileCompletion } from '@/features/profile'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatDate } from '@/utils/formatters'

/**
 * My Profile page — read-only personal and contact details.
 */
function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profileData } = useProfile()
  const { data: emergencyData } = useEmergencyContact()
  const { data: completionData } = useProfileCompletion()

  const profile = useMemo(() => profileData ?? {}, [profileData])
  const emergency = useMemo(() => emergencyData ?? null, [emergencyData])
  const completion = useMemo(() => completionData?.percentage ?? 0, [completionData])
  const merged = { ...user, ...profile, profileCompletion: completion }

  return (
    <AccountPageShell
      title="My Profile"
      description="Your personal information and contact details."
      actionLabel="Edit Profile"
      onAction={() => navigate(ROUTES.EDIT_PROFILE)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileCard user={merged} onView={() => navigate(ROUTES.EDIT_PROFILE)} />
        </Grid>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <UserAvatar
                firstName={merged.firstName}
                lastName={merged.lastName}
                src={merged.avatar}
                size={56}
              />
              <Box>
                <Typography variant="subtitle1">
                  {merged.firstName} {merged.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(merged.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Contact Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {merged.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {merged.phone || '—'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Emergency Contact
            </Typography>
            {emergency ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Name: {emergency.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {emergency.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relation: {emergency.relationship}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No emergency contact added yet.
              </Typography>
            )}
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default ProfilePage
