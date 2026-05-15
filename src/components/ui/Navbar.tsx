'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Search, GitCompareArrows, LayoutGrid, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Brain },
  { href: '/models', label: 'Models', icon: LayoutGrid },
  { href: '/categories', label: 'Categories', icon: Search },
  { href: '/compare', label: 'Compare', icon: GitCompareArrows },
  { href: '/admin', label: 'Admin Dashboard', icon: Brain }, // New link
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 17, 32, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <nav className="section-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'inherit',
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={22} color="white" />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Model<span className="gradient-text">IQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }} className="nav-desktop">
          {navLinks.map(link => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                <Icon size={16} style={{ opacity: isActive ? 1 : 0.6 }} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-mobile-toggle" style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          padding: 8,
        }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          padding: '8px 24px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                textDecoration: 'none',
              }}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
