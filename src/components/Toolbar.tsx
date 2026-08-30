interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function Toolbar({ search, onSearchChange }: ToolbarProps) {
  return (
    <section className="toolbar">
      <label className="field-search">
        <svg className="icon field-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <input
          type="search"
          placeholder="Search bangles or bracelets"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search bangles or bracelets"
        />
      </label>
    </section>
  )
}
