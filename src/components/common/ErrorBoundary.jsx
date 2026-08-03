import { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Container, Typography, Box } from '@mui/material'

/**
 * Error boundary that catches rendering errors and shows a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service (e.g. Sentry) in production.
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            An unexpected error occurred. Please try again.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Reload Page
            </Button>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
