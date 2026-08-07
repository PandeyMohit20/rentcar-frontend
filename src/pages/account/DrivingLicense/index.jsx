import { useMemo } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { AccountPageShell, DrivingLicenseCard, DocumentUploader } from '@/components/account'
import { useKycStatus, useSubmitKycDocument } from '@/features/kyc'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Driving License page — status and upload placeholder.
 */
function DrivingLicensePage() {
  const { showSuccess, showError } = useToast()
  const { data: kycData } = useKycStatus()
  const submitDoc = useSubmitKycDocument()

  const license = useMemo(() => kycData?.drivingLicense ?? {}, [kycData])

  const handleUpload = async (file) => {
    try {
      await submitDoc.mutateAsync({ type: 'drivingLicense', fileName: file?.name })
      showSuccess('Driving license submitted for review.')
    } catch (error) {
      showError(error?.message || 'Failed to submit driving license.')
    }
  }

  return (
    <AccountPageShell title="Driving License" description="Verify your driving license details.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DrivingLicenseCard license={license} onUpload={() => {}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Document
            </Typography>
            <DocumentUploader
              label="Driving License"
              onUpload={handleUpload}
              accept="image/*,.pdf"
            />
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default DrivingLicensePage
