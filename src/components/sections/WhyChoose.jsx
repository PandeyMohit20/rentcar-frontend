import PropTypes from 'prop-types'
import { Box, Grid, Typography } from '@mui/material'
import SectionTitle from './SectionTitle'
import FeatureCard from '@/components/cards/FeatureCard'
import Reveal from '@/components/animations/Reveal'

/**
 * "Why choose us" value proposition grid.
 */
function WhyChoose({ eyebrow, title, subtitle, features = [] }) {
  return (
    <Box>
      <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Grid container spacing={3}>
        {features.map((feature, idx) => (
          <Grid item key={feature.title ?? idx} xs={12} sm={6} md={4}>
            <Reveal delay={idx * 0.08}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

WhyChoose.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}

export default WhyChoose
