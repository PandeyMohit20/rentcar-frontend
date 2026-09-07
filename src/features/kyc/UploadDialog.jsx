import { accountControlStyles } from '@/features/account/accountStyles'
import { useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDeleteKycDocument, useUploadKycDocument } from './useKyc'
import { kycService } from '@/services/modules/kycService'
import { KYC_ACCEPT, validateKycFile, validateKycExpiry } from './kycRules'
import { AccountError } from '@/components/account/AccountUI'
import { setAccountFieldErrors } from '@/features/account/errors'

export default function UploadDialog({ type, replacing, onClose }) {
  const upload = useUploadKycDocument()
  const deletion = useDeleteKycDocument()
  const input = useRef(null)
  const [removed, setRemoved] = useState(false)
  const guard = useRef(false)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [notice, setNotice] = useState('')
  const [requestError, setRequestError] = useState(null)
  const [checking, setChecking] = useState(false)
  const [uncertain, setUncertain] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { issuedAt: '', expiresAt: '' } })
  const busy = upload.isPending || deletion.isPending || isSubmitting || checking
  const choose = (selected) => {
    const error = validateKycFile(selected)
    setFileError(error || '')
    setFile(error ? null : selected)
    if (input.current) input.current.value = ''
  }
  const save = async (values) => {
    if (guard.current || uncertain) return
    const invalid = validateKycFile(file)
    if (invalid) {
      setFileError(invalid)
      return
    }
    guard.current = true
    setNotice('')
    setRequestError(null)
    setChecking(true)
    try {
      // Recheck live ownership state before a non-idempotent upload or replacement.
      const [documents, status] = await Promise.all([
        kycService.listDocuments(),
        kycService.getStatus(),
      ])
      if (status.verificationStatus === 'verified') {
        setNotice('Your identity is already verified. Close this dialog to view the latest status.')
        return
      }
      const pending = documents.filter(
        (doc) => doc.documentType === type.key && doc.status === 'pending'
      )
      if (pending.some((doc) => doc.id !== replacing?.id || removed)) {
        setNotice(
          'A pending document of this type already exists. Close this dialog and review it before uploading another copy.'
        )
        return
      }
      if (replacing && !removed) {
        const existing = documents.find((doc) => doc.id === replacing.id)
        if (!existing || existing.status !== 'pending') {
          setNotice(
            'This document has changed. Close this dialog and refresh your documents before continuing.'
          )
          return
        }
        await deletion.mutateAsync(replacing.id)
        setRemoved(true)
      }
      const form = new FormData()
      form.append('file', file)
      form.append('documentType', type.key)
      if (values.issuedAt) form.append('issuedAt', values.issuedAt)
      if (values.expiresAt) form.append('expiresAt', values.expiresAt)
      await upload.mutateAsync(form)
      toast.success(replacing ? 'Document replaced' : 'Document uploaded')
      onClose()
    } catch (error) {
      setRequestError(error)
      setAccountFieldErrors(error, setError, ['issuedAt', 'expiresAt'])
      if (error?.isNetworkError || error?.status >= 500) {
        setUncertain(true)
        setNotice(
          'The result could not be confirmed. Close this dialog and refresh your documents before starting another upload.'
        )
      }
    } finally {
      guard.current = false
      setChecking(false)
    }
  }
  return (
    <Dialog
      sx={accountControlStyles}
      open
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="upload-title"
      aria-describedby="upload-description"
      slotProps={{
        paper: { sx: { m: { xs: 1, sm: 4 }, width: { xs: 'calc(100% - 16px)', sm: '100%' } } },
      }}
    >
      <DialogTitle id="upload-title">
        {replacing ? 'Replace ' : 'Upload '}
        {type.label}
      </DialogTitle>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
        component="form"
        onSubmit={(event) => handleSubmit(save)(event)}
        noValidate
      >
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            <Typography id="upload-description" color="text.secondary">
              {type.description} PDF, JPEG or PNG, up to 10 MB.
            </Typography>
            {replacing && (
              <Alert severity="warning">
                {removed
                  ? 'The previous document has been removed. Upload your new file to finish replacing it.'
                  : 'Replacing removes this pending document before uploading the new file. If the upload fails, you will need to upload it again. Your verification status does not change until you submit.'}
              </Alert>
            )}
            <Box
              sx={{
                border: '2px dashed',
                borderColor: fileError ? 'error.main' : 'divider',
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                bgcolor: 'action.hover',
                textAlign: 'center',
              }}
              onDragOver={(event) => {
                event.preventDefault()
              }}
              onDrop={(event) => {
                event.preventDefault()
                if (!busy && !uncertain) {
                  if (event.dataTransfer.files.length !== 1)
                    setFileError('Choose one file at a time.')
                  else choose(event.dataTransfer.files[0])
                }
              }}
            >
              <UploadFileOutlinedIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
              <input
                ref={input}
                type="file"
                accept={KYC_ACCEPT}
                hidden
                disabled={busy || uncertain}
                onChange={(event) => {
                  if (event.target.files?.[0]) choose(event.target.files[0])
                }}
              />
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                Drop a file here or choose one from your device.
              </Typography>
              <Button
                variant="outlined"
                type="button"
                onClick={() => input.current?.click()}
                disabled={busy || uncertain}
                aria-describedby="kyc-file-feedback"
              >
                {file ? 'Choose another file' : 'Choose file'}
              </Button>
              {file && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ overflowWrap: 'anywhere' }}>{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Button
                    color="inherit"
                    size="small"
                    disabled={busy || uncertain}
                    onClick={() => {
                      setFile(null)
                      setFileError('')
                    }}
                  >
                    Clear file
                  </Button>
                </Box>
              )}
              <Typography
                id="kyc-file-feedback"
                role={fileError ? 'alert' : undefined}
                color="error"
                variant="body2"
                sx={{ mt: 1 }}
              >
                {fileError}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2.5,
              }}
            >
              <TextField
                id="kyc-issued"
                label="Issue date (optional)"
                type="date"
                disabled={busy || uncertain}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('issuedAt')}
                error={Boolean(errors.issuedAt)}
                helperText={errors.issuedAt?.message}
              />
              <TextField
                id="kyc-expiry"
                label={type.required ? 'Expiry date' : 'Expiry date (optional)'}
                type="date"
                required={type.required}
                disabled={busy || uncertain}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('expiresAt', {
                  required: type.required ? 'Enter your driving licence expiry date.' : false,
                  validate: (value, values) =>
                    validateKycExpiry(value, values.issuedAt, type.required),
                })}
                error={Boolean(errors.expiresAt)}
                helperText={
                  errors.expiresAt?.message ||
                  (type.required ? 'A current licence is required for submission.' : undefined)
                }
              />
            </Box>
            {notice && <Alert severity="warning">{notice}</Alert>}
            {requestError && <AccountError error={requestError} />}
            {busy && (
              <Box role="status">
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Saving your document… Please keep this dialog open.
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose} disabled={busy}>
            {uncertain ? 'Close and review' : 'Cancel'}
          </Button>
          <Button type="submit" variant="contained" disabled={busy || !file || uncertain}>
            {busy ? 'Saving…' : replacing && !removed ? 'Replace document' : 'Upload document'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
