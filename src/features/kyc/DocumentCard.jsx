import { useState } from 'react'
import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { AccountSection, AccountError } from '@/components/account/AccountUI'
import { kycService } from '@/services/modules/kycService'
import KycBadge from './KycBadge'
import { kycDate } from './kycRules'

function DocumentRecord({ document, canManage, onReplace, onDelete }) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)
  const download = async () => {
    if (downloading) return
    setDownloading(true)
    setError(null)
    try {
      await kycService.downloadDocument(document.id, document.documentType)
    } catch (reason) {
      setError(reason)
    } finally {
      setDownloading(false)
    }
  }
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
        <KycBadge document status={document.status} />
        <Typography variant="body2" color="text.secondary">
          Uploaded {kycDate(document.createdAt)}
        </Typography>
      </Stack>
      <Box>
        {document.issuedAt && (
          <Typography variant="body2" color="text.secondary">
            Issued {kycDate(document.issuedAt)}
          </Typography>
        )}
        {document.expiresAt && (
          <Typography variant="body2" color="text.secondary">
            Expires {kycDate(document.expiresAt)}
          </Typography>
        )}
      </Box>
      {document.status === 'rejected' && (
        <Alert severity="error">
          {document.rejectionReason ||
            'This document needs to be updated. Upload a new copy for review.'}
        </Alert>
      )}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Button size="small" variant="outlined" disabled={downloading} onClick={download}>
          {downloading ? 'Downloading…' : 'Download'}
        </Button>
        {canManage && document.status === 'pending' && (
          <>
            <Button size="small" onClick={() => onReplace(document)}>
              Replace
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(document)}>
              Delete
            </Button>
          </>
        )}
      </Stack>
      {error && (
        <AccountError
          error={error}
          fallback="The document could not be downloaded. Please try again."
        />
      )}
    </Stack>
  )
}
export default function DocumentCard({
  type,
  documents,
  canManage,
  onUpload,
  onReplace,
  onDelete,
}) {
  const pending = documents.some((document) => document.status === 'pending')
  return (
    <AccountSection>
      <Stack spacing={2}>
        <Stack direction="row" gap={1.5} alignItems="center">
          <DescriptionOutlinedIcon color="primary" />
          <Typography variant="h6" component="h2">
            {type.label}
          </Typography>
        </Stack>
        <Box>
          <Chip
            size="small"
            label={type.required ? 'Required for submission' : 'Optional'}
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {type.description}
          </Typography>
        </Box>
        {documents.length ? (
          documents.map((document, index) => (
            <Box key={document.id}>
              {index > 0 && <Divider sx={{ mb: 2 }} />}
              <DocumentRecord
                document={document}
                canManage={canManage}
                onReplace={onReplace}
                onDelete={onDelete}
              />
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No document uploaded yet.
          </Typography>
        )}
        {canManage && !pending && (
          <Button variant={type.required ? 'contained' : 'outlined'} onClick={onUpload}>
            {documents.length ? 'Upload new copy' : 'Upload document'}
          </Button>
        )}
        {canManage && documents.length > 0 && !pending && (
          <Typography variant="body2" color="text.secondary">
            Reviewed copies remain in your document history.
          </Typography>
        )}
      </Stack>
    </AccountSection>
  )
}
