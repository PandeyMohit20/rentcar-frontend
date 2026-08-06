import PropTypes from 'prop-types'
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/**
 * Car-specific FAQ accordion.
 */
function CarFaq({ faqs = [] }) {
  if (faqs.length === 0) return null

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Car FAQs
      </Typography>
      {faqs.map((faq) => (
        <Accordion key={faq.id ?? faq.question} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

CarFaq.propTypes = {
  faqs: PropTypes.arrayOf(PropTypes.object),
}

export default CarFaq
