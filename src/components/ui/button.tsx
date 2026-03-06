'use client'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer"

  const variants = {
    primary: 'bg-[#3b82f6] text-white hover:bg-[#2563eb]',
    outline: 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white',
    accent: 'bg-[#0cb6d8] text-white hover:bg-[#0a9db8]',
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-[14px]',
    md: 'px-6 py-2.5 text-[16px]',
    lg: 'px-8 py-3 text-[16px]',
  }


  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
