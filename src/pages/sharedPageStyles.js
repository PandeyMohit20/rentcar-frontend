/**
 * Shared page-level style helpers.
 * Centralizes common layout/spacing patterns used across pages.
 */
export const pageContainer = {
  width: '100%',
  mx: 'auto',
  maxWidth: 1200,
  px: { xs: 2, sm: 3, md: 4 },
}

export const sectionSpacing = {
  py: { xs: 6, md: 10 },
}

export const pageHeader = {
  mb: 4,
}

export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const gridSpacing = { xs: 2, sm: 3, md: 4 }

export default {
  pageContainer,
  sectionSpacing,
  pageHeader,
  flexCenter,
  flexBetween,
  gridSpacing,
}
