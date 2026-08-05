import PropTypes from 'prop-types'
import { Box, Grid } from '@mui/material'
import SectionTitle from './SectionTitle'
import ReviewCard from '@/components/cards/ReviewCard'
import Reveal from '@/components/animations/Reveal'

/**
 * Customer reviews grid section.
 */
function ReviewsGrid({ eyebrow, title, subtitle, reviews = [] }) {
  return (
    <Box>
      <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Grid container spacing={3}>
        {reviews.map((review, idx) => (
          <Grid item key={review.id ?? idx} xs={12} sm={6} md={4}>
            <Reveal delay={idx * 0.08}>
              <ReviewCard review={review} />
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

ReviewsGrid.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object),
}

export default ReviewsGrid
