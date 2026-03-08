'use client'

export interface ButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'outline' | 'accent' | 'ghost' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default' | 'clear'
  className?: string
  onClick?: () => void
  [key: string]: unknown
}

const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer'

const variantStyles: Record<string, string> = {
  primary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb]',
  default: 'bg-[#3b82f6] text-white hover:bg-[#2563eb]',
  outline: 'border border-[#3b82f6] text-[#3b82f6] ',
  accent: 'bg-[#0cb6d8] text-white hover:bg-[#0a9db8]',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-1.5 text-[14px]',
  md: 'px-6 py-2.5 text-[16px]',
  default: 'px-6 py-2.5 text-[16px]',
  lg: 'px-8 py-3 text-[16px]',
  icon: 'h-9 w-9 p-0',
  clear: '',
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
}: { variant?: ButtonProps['variant']; size?: ButtonProps['size'] } = {}): string {
  return [
    baseStyles,
    variantStyles[variant ?? 'primary'] ?? variantStyles.primary,
    sizeStyles[size ?? 'md'] ?? sizeStyles.md,
  ].join(' ')
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${buttonVariants({ variant, size })} ${className}`}
      onClick={onClick}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
