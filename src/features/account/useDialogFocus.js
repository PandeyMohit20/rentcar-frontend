import { useRef } from 'react'

// Conditional form dialogs can unmount their trigger after a successful mutation.
export function useDialogFocus() {
  const trigger = useRef(null)
  const captureFocus = () => {
    trigger.current = document.activeElement
  }
  const restoreFocus = () => {
    const target = trigger.current
    window.requestAnimationFrame(() => {
      if (target?.isConnected) target.focus()
      else document.querySelector('#account-main h1')?.focus()
    })
  }
  return { captureFocus, restoreFocus }
}
