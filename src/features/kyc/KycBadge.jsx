import { Chip, Skeleton } from '@mui/material'

const aggregate = {
  unverified: { label: 'Not started', color: 'default' },
  pending: { label: 'Under review', color: 'warning' },
  verified: { label: 'Verified', color: 'success' },
  rejected: { label: 'Update required', color: 'error' },
}
const documents = {
  pending: { label: 'Pending review', color: 'warning' },
  verified: { label: 'Verified', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  expired: { label: 'Expired', color: 'error' },
}
export default function KycBadge({ status, document = false, loading = false }) {
  if (loading) return <Skeleton width={110} height={32} aria-label="Loading verification status" />
  const meta = (document ? documents : aggregate)[status] || {
    label: 'Status unavailable',
    color: 'default',
  }
  return <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />
}
