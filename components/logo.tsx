export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Demos">
      <rect width="32" height="32" rx="6" fill="#101010" />
      <text
        x="16"
        y="25"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="31"
        fontWeight="600"
        fill="#B5714B"
        transform="rotate(-12 16 16)"
      >
        D
      </text>
    </svg>
  )
}
