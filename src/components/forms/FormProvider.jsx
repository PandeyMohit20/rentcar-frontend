import PropTypes from 'prop-types'
import { FormProvider as RHFProvider } from 'react-hook-form'

/**
 * Wraps react-hook-form's FormProvider for convenience.
 */
function FormProvider({ children, ...props }) {
  return <RHFProvider {...props}>{children}</RHFProvider>
}

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FormProvider
