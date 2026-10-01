import { useState } from 'react'
import { Alert, Button, Stack } from '@mui/material'
import httpClient from '@/services/api/httpClient'

export default function InvoiceDownload({ invoice }) {
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState(null)

  if (!invoice) return null

  const fetchPdf = async () => {
    return httpClient.get(`/bookings/${invoice.bookingId}/invoice/download`, {
      responseType: 'blob',
    })
  }

  const view = async () => {
    if (busyAction) return

    setBusyAction('view')
    setError('')

    // Open synchronously so popup blockers do not block the
    // tab after the asynchronous API request finishes.
    const previewWindow = window.open('', '_blank')

    try {
      const blob = await fetchPdf()
      const url = URL.createObjectURL(blob)

      if (previewWindow) {
        previewWindow.location.href = url
      } else {
        window.open(url, '_blank')
      }

      // Keep the object URL alive long enough for the browser's
      // PDF viewer to load it.
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch {
      if (previewWindow) {
        previewWindow.close()
      }

      setError('Invoice preview is unavailable. Please retry or contact support.')
    } finally {
      setBusyAction(null)
    }
  }

  const download = async () => {
    if (busyAction) return

    setBusyAction('download')
    setError('')

    try {
      const blob = await fetchPdf()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${invoice.invoiceNumber}.pdf`

      document.body.appendChild(a)
      a.click()
      a.remove()

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError('Invoice download is unavailable. Please retry or contact support.')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <Stack spacing={1} sx={{ my: 2 }}>
      {invoice.pdfBlocker ? (
        <Alert severity="info">
          This document is currently unavailable. Please contact support.
        </Alert>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="contained" onClick={view} disabled={Boolean(busyAction)}>
            {busyAction === 'view' ? 'Opening…' : 'View Invoice PDF'}
          </Button>

          <Button variant="outlined" onClick={download} disabled={Boolean(busyAction)}>
            {busyAction === 'download' ? 'Downloading…' : 'Download PDF'}
          </Button>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  )
}
