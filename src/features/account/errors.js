// Display deliberate client-error messages, never transport errors or server stacks.
export function accountError(
  error,
  fallback = 'We could not complete this request. Please try again.'
) {
  if (error?.data?.error?.code === 'LIMIT_FILE_SIZE' || error?.status === 413)
    return 'File is too large. Choose a file up to 10 MB.'
  if (error?.isNetworkError)
    return 'Connection interrupted. Refresh this section to check whether your change was saved before trying again.'
  if (error?.status === 401) return 'Your session has expired. Please sign in again.'
  if (error?.status === 403) return 'You do not have access to this action.'
  if (error?.status === 429) return 'Too many requests. Please wait a moment before trying again.'
  if ([400, 404, 409, 422].includes(error?.status) && typeof error?.data?.message === 'string')
    return error.data.message
  return fallback
}
export function setAccountFieldErrors(error, setError, fields) {
  const issues = error?.data?.error?.details?.issues
  if (!Array.isArray(issues)) return
  issues.forEach((issue) => {
    const field = Array.isArray(issue.path) ? issue.path[0] : null
    if (fields.includes(field) && typeof issue.message === 'string')
      setError(field, { type: 'server', message: issue.message })
  })
}
