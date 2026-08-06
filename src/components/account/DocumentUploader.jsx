import PropTypes from 'prop-types'
import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Single-file upload placeholder with preview name.
 */
function DocumentUploader({ label, onUpload, accept = 'image/*,.pdf' }) {
  const [fileName, setFileName] = useState('')

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onUpload?.(file)
    }
  }

  return (
    <MaterialCard sx={{ p: 3, textAlign: 'center' }}>
      <UploadFileIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
        {fileName || 'No file selected'}
      </Typography>
      <Button variant="outlined" component="label" aria-label={`Upload ${label}`}>
        Choose File
        <input type="file" hidden accept={accept} onChange={handleChange} />
      </Button>
    </MaterialCard>
  )
}

DocumentUploader.propTypes = {
  label: PropTypes.string,
  onUpload: PropTypes.func,
  accept: PropTypes.string,
}

export default DocumentUploader
