import { useEffect, useState } from 'react'
import { Alert, Box, Button } from '@mui/material'
import { useAppDispatch } from '@/hooks/useRedux'
import { authService } from '@/services/modules/authService'
import { restoreFailure, restoreStart, restoreSuccess } from '@/redux/slices/authSlice'
import { clearCustomerSession } from '@/services/api/customerSession'
import authSession from '@/services/api/authSession'

let restorePromise = null
function readSession() {
  if (!restorePromise) restorePromise = authService.getMe().finally(() => { restorePromise = null })
  return restorePromise
}
function SessionBootstrap({ children }) {
  const dispatch = useAppDispatch()
  const [attempt, setAttempt] = useState(0)
  const [problem, setProblem] = useState(false)
  useEffect(() => {
    let active = true
    const version = authSession.getVersion()
    if (authSession.isSignedOut()) { dispatch(restoreFailure()); return undefined }
    dispatch(restoreStart())
    readSession().then(me => {
      if (active && version === authSession.getVersion()) dispatch(restoreSuccess(me.data.user))
    }).catch(error => {
      if (!active || error.sessionChanged) return
      if ([401,403].includes(error.status)) dispatch(restoreFailure())
      else setProblem(true)
    })
    return () => { active = false }
  }, [attempt, dispatch])
  useEffect(() => {
    const expire = () => { clearCustomerSession(); dispatch(restoreFailure()); setProblem(false) }
    const retry = () => { setProblem(false); setAttempt(value => value + 1) }
    window.addEventListener('rentcar:session-expired', expire)
    const online = () => { if (problem) retry() }
    window.addEventListener('online', online)
    return () => { window.removeEventListener('rentcar:session-expired', expire); window.removeEventListener('online', online) }
  }, [dispatch, problem])
  return <>
    {problem && <Box sx={{ p: 2 }}><Alert severity="warning" action={<Button color="inherit" onClick={() => { setProblem(false); setAttempt(value => value + 1) }}>Retry</Button>}>
      We could not restore your session. Check your connection and retry.
    </Alert></Box>}
    {children}
  </>
}
export default SessionBootstrap

