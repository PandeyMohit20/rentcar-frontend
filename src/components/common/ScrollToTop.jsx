import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window to the top on route change.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const scrollToSection = () => {
        const section = document.getElementById(hash.slice(1))
        if (section) {
          section.scrollIntoView({ block: 'start' })
          observer.disconnect()
        }
      }
      const observer = new MutationObserver(scrollToSection)
      observer.observe(document.getElementById('root'), { childList: true, subtree: true })
      scrollToSection()
      const timeout = window.setTimeout(() => observer.disconnect(), 10000)
      return () => {
        observer.disconnect()
        window.clearTimeout(timeout)
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return undefined
  }, [pathname, hash])

  return null
}

export default ScrollToTop
