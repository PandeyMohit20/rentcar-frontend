import { useMemo } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import {
  AccountPageShell,
  KYCStatus,
  DocumentUploader,
  DrivingLicenseCard,
} from '@/components/account'
import { useKycStatus, useSubmitKycDocument } from '@/features/kyc'
import { KYC_DOCUMENT_META } from '@/features/account'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * KYC page — status overview and document upload placeholders.
 */
function KycPage() {
  const { showSuccess, showError } = useToast()
  const { data: kycData } = useKycStatus()
  const submitDoc = useSubmitKycDocument()

  const kyc = useMemo(() => kycData ?? {}, [kycData])

  const handleUpload = async (type, file) => {
    try {
      await submitDoc.mutateAsync({ type, fileName: file?.name })
      showSuccess(`${type} document submitted for review.`)
    } catch (error) {
      showError(error?.message || 'Failed to submit document.')
    }
  }

  return (
    <AccountPageShell title="KYC" description="Complete your identity verification.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <KYCStatus kyc={kyc} />
        </Grid>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Identity Documents
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
            >
              {KYC_DOCUMENT_META.map((doc) => (
                <DocumentUploader
                  key={doc.key}
                  label={doc.label}
                  onUpload={(file) => handleUpload(doc.key, file)}
                />
              ))}
            </Box>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default KycPage
