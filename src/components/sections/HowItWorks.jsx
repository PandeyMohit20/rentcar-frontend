import PropTypes from 'prop-types'
import { Box, Grid, Typography } from '@mui/material'
import SectionTitle from './SectionTitle'
import Reveal from '@/components/animations/Reveal'

/**
 * "How it works" steps section.
 */
function HowItWorks({ eyebrow, title, steps = [] }) {
  return (
    <Box>
      <SectionTitle eyebrow={eyebrow} title={title} />
      <Grid container spacing={3}>
        {steps.map((step, idx) => (
          <Grid item key={step.title ?? idx} xs={12} sm={6} md={3}>
            <Reveal delay={idx * 0.1}>
              <Box sx={{ textAlign: 'center', px: 1 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  {idx + 1}
                </Box>
                {step.icon}
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

HowItWorks.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}

export default HowItWorks
