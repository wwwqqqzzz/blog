import React from 'react'
import { cn } from '@site/src/lib/utils'

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className={cn(
          'pointer-events-none absolute -top-40 left-0 right-0 bottom-0 z-10',
          'dark:bg-[radial-gradient(circle_800px_at_50%_-40%,rgba(59,130,246,0.3),transparent_100%)]',
          'bg-[radial-gradient(circle_800px_at_50%_-40%,rgba(59,130,246,0.1),transparent_100%)]',
        )}
      />
    </div>
  )
}
