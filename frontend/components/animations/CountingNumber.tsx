'use client'

import { useEffect, useState } from 'react'
import { useSpring, useTransform, useMotionValueEvent } from 'framer-motion'

interface CountingNumberProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
}

export function CountingNumber({
  value,
  duration = 1,
  className,
  suffix = '',
}: CountingNumberProps) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )
  const [displayValue, setDisplayValue] = useState('0')

  useMotionValueEvent(display, 'change', (latest) => setDisplayValue(latest))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  )
}
