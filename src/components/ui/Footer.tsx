import { Brain, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(11, 17, 32, 0.6)',
      marginTop: '80px',
    }}>
      <div className="section-container" style={{
        padding: '48px 24px 32px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Brain size={18} color="white" />
              </div>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
              }}>
                ModelIQ
              </span>
            </div>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              maxWidth: 280,
            }}>
              The most accurate AI model comparison platform.
              Find the best model for your needs in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/models', label: 'Explore Models' },
                { href: '/categories', label: 'Categories' },
                { href: '/compare', label: 'Compare' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Top Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Coding', 'Writing', 'Reasoning', 'Image Generation'].map(cat => (
                <span key={cat} style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.9rem',
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Connect
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Github, Twitter].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            © 2026 ModelIQ. All rights reserved.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            Built with ❤️ for the AI community
          </p>
        </div>
      </div>
    </footer>
  );
}
