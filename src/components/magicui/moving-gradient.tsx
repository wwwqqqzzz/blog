import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'
import React from 'react'

export const MovingGradient = ({
  children,
  className,
  containerClassName,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  return (
    <div className={cn('relative overflow-hidden', containerClassName)} {...props}>
      <motion.div
        className={cn(
          'pointer-events-none absolute -inset-[100%] opacity-50',
          'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent',
          className,
        )}
        animate={{
          x: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 15,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      {children}
    </div>
  )
}
