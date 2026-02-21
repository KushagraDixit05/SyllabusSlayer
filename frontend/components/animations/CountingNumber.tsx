'use client'

import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

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

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span className={className}>
      {display}
      {suffix}
    </motion.span>
  )
}
