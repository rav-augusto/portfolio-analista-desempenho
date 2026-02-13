'use client'

import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'
import { HTMLAttributes, forwardRef, useEffect } from 'react'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, size = 'lg', children, ...props }, ref) => {
    // Fechar com ESC
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEsc)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80 animate-fade-in" />

        {/* Modal Content */}
        <div
          ref={ref}
          className={cn(
            'relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-fade-in-up',
            size === 'sm' && 'w-full max-w-md',
            size === 'md' && 'w-full max-w-xl',
            size === 'lg' && 'w-full max-w-3xl',
            size === 'xl' && 'w-full max-w-5xl',
            className
          )}
          {...props}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 bg-gradient-dark text-white">
              <h2 className="text-2xl font-display tracking-wide">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }
