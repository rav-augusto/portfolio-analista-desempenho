'use client'

import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'
import { HTMLAttributes, ReactNode, useEffect } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: Size
  footer?: ReactNode
}

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  className,
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  ...props
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-app-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-overlay/80 backdrop-blur-sm" />
      <div
        className={cn(
          'relative w-full bg-surface border border-line rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-app-slide-up',
          'max-h-[calc(100dvh-2rem)] flex flex-col',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-line">
            <div className="min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-strong">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-soft mt-0.5">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 -m-1 p-1.5 rounded-lg text-faint hover:text-strong hover:bg-surface-2 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1">{children}</div>
        {footer && (
          <div className="border-t border-line p-3 sm:p-4 bg-app/40 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
