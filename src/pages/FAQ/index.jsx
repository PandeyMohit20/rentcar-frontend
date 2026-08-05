import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Seo from '@/components/common/Seo'
import EmptyState from '@/components/common/EmptyState'
import { contentService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { pageStyles } from './styles'

/**
 * FAQ page — collapsible frequently asked questions.
 */
function FaqPage() {
  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CONTENT.FAQ,
    queryFn: contentService.getFaqs,
  })

  const faqs = data?.data ?? data?.faqs ?? []

  return (
    <>
      <Seo title="FAQ" description="Frequently asked questions about RentCar." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Frequently Asked Questions
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState title="Unable to load FAQs" description="Please try again later." />
        ) : faqs.length === 0 ? (
          <EmptyState title="No FAQs yet" description="Check back soon for common questions." />
        ) : (
          faqs.map((faq) => (
            <Accordion key={faq.id ?? faq.question} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Container>
    </>
  )
}

export default FaqPage
