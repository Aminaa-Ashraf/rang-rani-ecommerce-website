import { NavLink } from 'react-router-dom'
import type { Customer } from '../../shared/types.ts'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/faq', label: 'FAQ', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

interface NavbarProps {
  customer: Customer | null
  cartCount: number
  onOpenCart: () => void
}

export function Navbar({ customer, cartCount, onOpenCart }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/">
          <img className="brand-logo" src="/logo.svg?v=lahore" alt="" />
          <span className="brand-name">Rang Rani</span>
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {customer ? (
            <NavLink className="account-link" to="/account">
              {customer.name}
            </NavLink>
          ) : null}
          <button
            className="cart-btn"
            type="button"
            onClick={onOpenCart}
            aria-label={`Cart, ${cartCount} items`}
          >
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Zm3.2 0V6.2A3.8 3.8 0 0 1 12 2.4a3.8 3.8 0 0 1 3.8 3.8V7"
              />
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
