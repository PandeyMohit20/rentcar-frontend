import { Box, Skeleton } from '@mui/material'

export default function ContentSkeleton({ label = 'Loading content', cards = 3 }) {
  return (
    <Box
      role="status"
      aria-label={label}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: `repeat(${Math.min(cards, 3)}, minmax(0, 1fr))`,
        },
        gap: 3,
        py: 3,
      }}
    >
      {Array.from({ length: cards }, (_, index) => (
        <Box key={index} aria-hidden="true">
          <Skeleton variant="rounded" height={200} />
          <Skeleton width="70%" height={36} />
          <Skeleton width="90%" height={24} />
          <Skeleton width="45%" height={44} />
        </Box>
      ))}
    </Box>
  )
}
