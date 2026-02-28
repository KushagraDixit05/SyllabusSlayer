import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Debounce hook for expensive operations.
 * Delays updating the returned value until after the delay has elapsed
 * since the last time the value changed.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook — limits how often a callback can fire.
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastCall = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const remaining = delay - (now - lastCall.current)

      if (remaining <= 0) {
        if (timeout.current) clearTimeout(timeout.current)
        lastCall.current = now
        return fn(...args)
      } else {
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
          lastCall.current = Date.now()
          fn(...args)
        }, remaining)
      }
    },
    [fn, delay]
  ) as T
}

/**
 * Intersection Observer hook for lazy loading / infinite scroll.
 * Calls `callback` when the returned ref element enters the viewport.
 */
export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement>(null)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          savedCallback.current()
        }
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return ref
}

/**
 * usePrevious — returns the previous value of a variable.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * useLocalStorage — persists state in localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error storing key "${key}" in localStorage:`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
