import { Link } from 'react-router-dom'
import { STUDIO_MAIL } from '../lib/contact.ts'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <p className="footer-name">Rang Rani</p>
            <p className="footer-domain">rangrani.pk</p>
            <p className="footer-blurb">Jewelry from Lahore. Beads, kundan, charms, and bridal sets.</p>
          </div>
          <div>
            <p className="footer-label">Shop</p>
            <Link to="/">Home</Link>
            <Link to="/shop">Jewelry wall</Link>
            <Link to="/collections">Collections</Link>
          </div>
          <div>
            <p className="footer-label">Studio</p>
            <Link to="/about">Our story</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Visit us</Link>
          </div>
          <div>
            <p className="footer-label">Write</p>
            <a href={STUDIO_MAIL}>Write to the studio</a>
            <a href="https://rangrani.pk" target="_blank" rel="noreferrer">
              rangrani.pk
            </a>
            <p>Lahore · ships everywhere</p>
          </div>
        </div>
        <div className="footer-bar">
          <p>© {new Date().getFullYear()} Rang Rani · rangrani.pk</p>
        </div>
      </div>
    </footer>
  )
}
