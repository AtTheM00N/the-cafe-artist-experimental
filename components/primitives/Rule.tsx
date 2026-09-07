type RuleProps = { className?: string }

/** A hairline that behaves like a table edge — draws itself in on scroll. */
export function Rule({ className = '' }: RuleProps) {
  return (
    <div
      aria-hidden
      data-motion="rule"
      className={`h-px w-full origin-left bg-rule ${className}`}
    />
  )
}
