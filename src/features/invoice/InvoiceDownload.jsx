import { useState } from 'react'
import { Alert, Button, Stack } from '@mui/material'
import httpClient from '@/services/api/httpClient'

export default function InvoiceDownload({ invoice }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!invoice) return null
  const download = async () => {
    setBusy(true)
    setError('')
    try {
      const blob = await httpClient.get(`/bookings/${invoice.bookingId}/invoice/download`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${invoice.invoiceNumber}.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError('Invoice download is unavailable. Please retry or contact support.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Stack spacing={1} sx={{ my: 2 }}>
      {invoice.pdfBlocker ? (
        <Alert severity="info">PDF unavailable: {invoice.pdfBlocker}</Alert>
      ) : (
        <Button onClick={download} disabled={busy}>
          {busy ? 'Downloading…' : 'Download Invoice PDF'}
        </Button>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  )
}
