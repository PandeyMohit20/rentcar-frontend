import { useMemo } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
import { AccountPageShell, DocumentUploader } from '@/components/account'
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/features/documents'
import { useToast } from '@/contexts/ToastContext'
import EmptyState from '@/components/common/EmptyState'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Documents page — upload and manage documents.
 */
function DocumentsPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useDocuments()
  const uploadDoc = useUploadDocument()
  const deleteDoc = useDeleteDocument()

  const documents = useMemo(() => data?.documents ?? [], [data])

  const handleUpload = async (file) => {
    try {
      await uploadDoc.mutateAsync({ fileName: file?.name })
      showSuccess('Document uploaded (placeholder).')
    } catch (error) {
      showError(error?.message || 'Failed to upload document.')
    }
  }

  const handleDelete = async (doc) => {
    try {
      await deleteDoc.mutateAsync(doc.id)
      showSuccess('Document deleted.')
    } catch (error) {
      showError(error?.message || 'Failed to delete document.')
    }
  }

  return (
    <AccountPageShell title="Documents" description="Manage your uploaded documents.">
      <MaterialCard sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload a Document
        </Typography>
        <DocumentUploader label="Document" onUpload={handleUpload} />
      </MaterialCard>
      <MaterialCard sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          My Documents
        </Typography>
        {documents.length === 0 ? (
          <EmptyState
            icon={FolderIcon}
            title="No documents"
            description="Documents you upload will appear here."
          />
        ) : (
          <Box>
            {documents.map((doc) => (
              <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FolderIcon color="action" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">{doc.name ?? doc.fileName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.type}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="Delete document"
                  color="error"
                  onClick={() => handleDelete(doc)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </MaterialCard>
    </AccountPageShell>
  )
}

export default DocumentsPage
