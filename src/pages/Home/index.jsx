import { Box, Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'

/**
 * Home page — landing view.
 */
function HomePage() {
  return (
    <>
      <Seo
        title="Home"
        description="Book self-drive cars on demand with flexible plans. Enterprise car rental platform."
      />
      <Container maxWidth="lg">
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" gutterBottom>
              Rent a Car, Anywhere
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Book self-drive cars on demand with flexible plans and transparent pricing.
            </Typography>
            <Button
              component={Link}
              to={ROUTES.SEARCH}
              variant="contained"
              color="primary"
              size="large"
            >
              Search Cars
            </Button>
          </motion.div>
        </Box>
      </Container>
    </>
  )
}

export default HomePage
