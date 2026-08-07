import PropTypes from 'prop-types'
import { Container, Box, Typography, Button, Grid } from '@mui/material'
import Seo from '@/components/common/Seo'
import { motion } from 'framer-motion'

/**
 * Shared shell for account pages.
 * Renders SEO meta, a page header and the content area inside a Container.
 * Wraps children with the standard page transition animation.
 */
function AccountPageShell({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: Icon,
  children,
}) {
  return (
    <>
      <Seo title={title} description={description} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {title}
              </Typography>
              {description && (
                <Typography variant="body1" color="text.secondary">
                  {description}
                </Typography>
              )}
            </Box>
            {actionLabel && onAction && (
              <Button
                variant="contained"
                color="primary"
                startIcon={Icon ? <Icon /> : null}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </>
  )
}

AccountPageShell.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  actionIcon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
}

export default AccountPageShell
