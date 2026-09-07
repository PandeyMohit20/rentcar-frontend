import { useDialogFocus } from '@/features/account/useDialogFocus'
import { useState } from 'react'
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import toast from 'react-hot-toast'
import AccountPageShell from '@/components/account/AccountPageShell'
import {
  AccountSection,
  AccountSkeleton,
  AccountError,
  AccountConfirm,
} from '@/components/account/AccountUI'
import { useKycStatus, useKycDocuments, useDeleteKycDocument, useSubmitKyc } from '@/features/kyc'
import { KYC_TYPES, isCurrentLicence, kycDate } from '@/features/kyc/kycRules'
import KycBadge from '@/features/kyc/KycBadge'
import DocumentCard from '@/features/kyc/DocumentCard'
import UploadDialog from '@/features/kyc/UploadDialog'

export default function KycPage() {
  const status = useKycStatus()
  const documents = useKycDocuments()
  const deletion = useDeleteKycDocument()
  const submission = useSubmitKyc()
  const [upload, setUpload] = useState(null)
  const [removing, setRemoving] = useState(null)
  const { captureFocus, restoreFocus } = useDialogFocus()
  const openUpload = (options) => {
    captureFocus()
    setUpload(options)
  }
  const state = status.data?.verificationStatus
  const knownStatus = ['unverified', 'pending', 'verified', 'rejected'].includes(state)
  const ready =
    !status.isPending && !status.error && !documents.isPending && !documents.error && knownStatus
  const currentLicence = ready && documents.data.some(isCurrentLicence)
  const pendingLicence =
    ready &&
    documents.data.some((document) => document.status === 'pending' && isCurrentLicence(document))
  const canManage = ready && state !== 'verified' && !submission.isPending && !deletion.isPending
  const canSubmit = ready && pendingLicence && ['unverified', 'rejected'].includes(state)
  const refresh = () => {
    status.refetch()
    documents.refetch()
  }
  const remove = async () => {
    if (deletion.isPending) return
    try {
      await deletion.mutateAsync(removing.id)
      toast.success('Document deleted')
      setRemoving(null)
    } catch {
      /* Inline error. */
    }
  }
  const submit = async () => {
    if (!canSubmit || submission.isPending) return
    try {
      await submission.mutateAsync()
      toast.success('KYC submitted for verification')
    } catch {
      /* Inline error. */
    }
  }
  return (
    <AccountPageShell
      title="KYC Verification"
      description="Get ready for the road. Upload your documents and track your verification here."
    >
      <Stack spacing={3}>
        <AccountSection
          title="Your verification"
          action={
            <Button
              size="small"
              onClick={refresh}
              disabled={
                status.isFetching ||
                documents.isFetching ||
                submission.isPending ||
                deletion.isPending
              }
            >
              Refresh
            </Button>
          }
        >
          {status.isPending ? (
            <AccountSkeleton rows={1} />
          ) : status.error ? (
            <AccountError error={status.error} onRetry={() => status.refetch()} />
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" gap={1.5} alignItems="center">
                <VerifiedUserOutlinedIcon color={state === 'verified' ? 'success' : 'primary'} />
                <KycBadge status={state} />
              </Stack>
              <Typography>
                {state === 'verified'
                  ? 'Identity verification complete.'
                  : state === 'pending'
                    ? 'Your verification has been submitted. We will update this page when it has been reviewed.'
                    : state === 'rejected'
                      ? 'Please review the feedback and upload a current driving licence before submitting again.'
                      : 'Start with your driving licence, then add any optional supporting documents.'}
              </Typography>
              {state === 'rejected' && status.data.rejectionReason && (
                <Alert severity="error">{status.data.rejectionReason}</Alert>
              )}
              {status.data.submittedAt && (
                <Typography variant="body2" color="text.secondary">
                  Submitted {kycDate(status.data.submittedAt)}
                </Typography>
              )}
              {status.data.verifiedAt && (
                <Typography variant="body2" color="text.secondary">
                  Verified {kycDate(status.data.verifiedAt)}
                </Typography>
              )}
              {ready && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {currentLicence
                      ? '1 of 1 required documents uploaded and current'
                      : '0 of 1 required documents uploaded and current'}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={currentLicence ? 100 : 0}
                    aria-label="Required document progress"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Only a current driving licence is required for submission. Uploading a document
                    does not verify it.
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </AccountSection>
        {documents.isPending ? (
          <AccountSkeleton />
        ) : documents.error ? (
          <AccountError error={documents.error} onRetry={() => documents.refetch()} />
        ) : (
          <>
            {documents.data.length === 0 && (
              <Alert severity="info">
                Complete your verification by uploading the required documents.
              </Alert>
            )}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
                gap: 3,
              }}
            >
              {KYC_TYPES.map((type) => (
                <DocumentCard
                  key={type.key}
                  type={type}
                  documents={documents.data.filter(
                    (document) => document.documentType === type.key
                  )}
                  canManage={canManage}
                  onUpload={() => openUpload({ type })}
                  onReplace={(document) => openUpload({ type, replacing: document })}
                  onDelete={(document) => {
                    deletion.reset()
                    setRemoving(document)
                  }}
                />
              ))}
            </Box>
          </>
        )}
        <AccountSection
          title="Submit for verification"
          description="Check that your documents are clear, readable and up to date."
        >
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {state === 'verified'
                ? 'Your identity is verified. No further submission is needed.'
                : state === 'pending'
                  ? 'Your submission is under review. You do not need to submit again.'
                  : 'A current pending driving licence is needed before you can submit. Supporting documents are optional.'}
            </Typography>
            {submission.error && <AccountError error={submission.error} />}
            <Button
              variant="contained"
              disabled={!canSubmit || submission.isPending || deletion.isPending || Boolean(upload)}
              onClick={submit}
              sx={{ alignSelf: { sm: 'flex-start' } }}
            >
              {submission.isPending
                ? 'Submitting…'
                : state === 'verified'
                  ? 'Verified'
                  : state === 'pending'
                    ? 'Verification submitted'
                    : canSubmit
                      ? 'Submit for verification'
                      : 'Complete required document'}
            </Button>
          </Stack>
        </AccountSection>
        <Typography variant="body2" color="text.secondary">
          Your verification documents are stored privately. Access requires an authorised account.
        </Typography>
      </Stack>
      {upload && (
        <UploadDialog
          {...upload}
          onClose={() => {
            setUpload(null)
            restoreFocus()
            refresh()
          }}
        />
      )}
      <AccountConfirm
        open={Boolean(removing)}
        title="Delete this document?"
        message="This pending document will be permanently removed. You may need to upload another current driving licence before submitting verification."
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        pending={deletion.isPending}
        error={deletion.error}
      />
    </AccountPageShell>
  )
}
