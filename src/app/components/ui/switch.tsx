'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../../../lib/utils'


function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-[#9fccfa] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0974f1] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#0974f1]',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5'
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
