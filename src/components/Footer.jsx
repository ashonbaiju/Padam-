import { Globe, Mail } from 'lucide-react';

export default function Footer() {
  const socials = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Twitter / X',
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
        </svg>
      ),
    },
  ];

  const links = [
    'Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre',
    'Investor Relations', 'Jobs', 'Terms of Use', 'Privacy',
    'Legal Notices', 'Cookie Preferences', 'Corporate Info', 'Contact Us',
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-16 px-6 md:px-16 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Social icons */}
        <div className="flex items-center gap-5 mb-7">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-white/35 hover:text-white transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-sm text-white/35">
          {links.map((link) => (
            <a key={link} href="#" className="hover:text-white/65 transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Streamix. Powered by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01b4e4] hover:underline"
            >
              TMDB API
            </a>
            . For personal/demo use only.
          </p>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <Globe size={13} />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
