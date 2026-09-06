import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAppDispatch } from '@/hooks/useRedux'
import { authService } from '@/services/modules'
import authSession from '@/services/api/authSession'
import { restoreFailure, restoreStart, restoreSuccess } from '@/redux/slices/authSlice'
import { queryClient } from '@/services/queryClient'
import bookingAttemptSession from '@/services/api/bookingAttemptSession'
import cancellationAttemptSession from '@/services/api/cancellationAttemptSession'

function SessionBootstrap({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let active = true
    const restore = async () => {
      dispatch(restoreStart())
      try {
        const me = await authService.getMe()
        if (active) dispatch(restoreSuccess(me?.data?.user))
      } catch {
        authSession.clear()
        if (active) dispatch(restoreFailure())
      }
    }
    const expire = () => {
      authSession.clear()
      bookingAttemptSession.clearAll()
      cancellationAttemptSession.clear()
      queryClient.clear()
      dispatch(restoreFailure())
    }
    window.addEventListener('rentcar:session-expired', expire)
    restore()
    return () => {
      active = false
      window.removeEventListener('rentcar:session-expired', expire)
    }
  }, [dispatch])

  return children
}

SessionBootstrap.propTypes = { children: PropTypes.node.isRequired }
export default SessionBootstrap
