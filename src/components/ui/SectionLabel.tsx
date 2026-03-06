interface SectionLabelProps {
  text: string
  position?: 'left' | 'center'
  linePosition?: 'right' | 'both'
}

function SectionLabel({ text, position = 'left', linePosition = 'right' }: SectionLabelProps) {
  const line = <div className="w-[44px] h-[1px] bg-[#0cb6d8]" />
  return (
    <div className={`flex items-center gap-2 ${position === 'center' ? 'justify-center' : ''}`}>
      {linePosition === 'both' && line}
      <span className="font-['Inter',sans-serif] text-[16px] text-[#0cb6d8]">{text}</span>
      {(linePosition === 'right' || linePosition === 'both') && line}
    </div>
  )
}

interface SectionHeadingProps {
  label: string
  title: string
  align?: 'left' | 'center'
  labelPosition?: 'right' | 'both'
}

export function SectionHeading({
  label,
  title,
  align = 'left',
  labelPosition = 'right',
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center' : 'items-start'}`}>
      <SectionLabel text={label} position={align} linePosition={labelPosition} />
      <h2
        className={`font-['Inter',sans-serif] font-semibold text-[32px] md:text-[40px] text-[#020617] tracking-[-0.8px] ${align === 'center' ? 'text-center' : ''}`}
      >
        {title}
      </h2>
    </div>
  )
}
