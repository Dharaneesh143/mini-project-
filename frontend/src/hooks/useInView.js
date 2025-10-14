import { useEffect, useRef, useState } from 'react'

export const useInView = (options = { threshold: 0.15, rootMargin: '0px' }) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}

export default useInView

