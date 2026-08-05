import { Box, Container, Typography, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import EmptyState from '@/components/common/EmptyState'
import { contentService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { pageStyles } from './styles'

/**
 * Legal page — renders structured legal content from the content API.
 */
function LegalPage() {
  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CONTENT.LEGAL,
    queryFn: contentService.getLegalContent,
  })

  const content = data?.data ?? data

  if (isLoading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <>
        <Seo title="Legal" description="Legal information for RentCar." />
        <Container maxWidth="md" sx={pageStyles.container}>
          <EmptyState title="Unable to load legal content" description="Please try again later." />
        </Container>
      </>
    )
  }

  return (
    <>
      <Seo title="Legal" description="Legal information for RentCar." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          {content?.title ?? 'Legal Information'}
        </Typography>
        {content?.lastUpdated && (
          <Typography variant="body2" sx={pageStyles.lastUpdated}>
            Last updated: {content.lastUpdated}
          </Typography>
        )}
        {(content?.sections ?? []).map((section, idx) => (
          <Box key={idx} sx={pageStyles.section}>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            {Array.isArray(section.content) ? (
              <Box component="ul" sx={pageStyles.list}>
                {section.content.map((item, i) => (
                  <Typography
                    component="li"
                    key={i}
                    variant="body2"
                    color="text.secondary"
                    paragraph
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" paragraph>
                {section.content}
              </Typography>
            )}
          </Box>
        ))}
      </Container>
    </>
  )
}

export default LegalPage
