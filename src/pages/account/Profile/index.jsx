import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import AccountPageShell from '@/components/account/AccountPageShell'
import { AccountSection, AccountSkeleton, AccountError } from '@/components/account/AccountUI'
import {
  useProfile,
  useAccountIdentity,
  useUpdateProfile,
  useUpdateAccount,
} from '@/features/profile'
import ProfileSection from '@/features/profile/ProfileSection'
import { useKycStatus } from '@/features/kyc'
import KycBadge from '@/features/kyc/KycBadge'
import { ROUTES } from '@/constants/routes'

export default function ProfilePage() {
  const profile = useProfile()
  const account = useAccountIdentity()
  const kyc = useKycStatus()
  const updateProfile = useUpdateProfile()
  const updateAccount = useUpdateAccount()
  return (
    <AccountPageShell
      title="My Profile"
      description="Your details, thoughtfully organised. Update your information whenever you need to."
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {account.isPending ? (
            <AccountSkeleton />
          ) : account.error ? (
            <AccountError error={account.error} onRetry={() => account.refetch()} />
          ) : (
            <ProfileSection data={account.data} mutation={updateAccount} />
          )}
          {profile.isPending ? (
            <AccountSkeleton />
          ) : profile.error ? (
            <AccountError error={profile.error} onRetry={() => profile.refetch()} />
          ) : (
            <ProfileSection data={profile.data} mutation={updateProfile} personal />
          )}
        </Box>
        <AccountSection
          title="Identity verification"
          description="Your verification status and documents are managed together."
        >
          {kyc.error ? (
            <AccountError error={kyc.error} onRetry={() => kyc.refetch()} />
          ) : (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              gap={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <KycBadge status={kyc.data?.verificationStatus} loading={kyc.isPending} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  A current driving licence is required to submit your verification.
                </Typography>
              </Box>
              <Button component={Link} to={ROUTES.KYC} variant="outlined">
                Manage verification
              </Button>
            </Stack>
          )}
        </AccountSection>
      </Stack>
    </AccountPageShell>
  )
}
