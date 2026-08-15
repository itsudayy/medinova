// lucide-react (this project's version) ships no brand/social icons, so these
// are small inline glyphs using currentColor — they inherit hover/dark-mode
// color from their parent exactly like a lucide icon would.

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.3V21h3.2z" />
    </svg>
  );
}

export function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H21l-6.7 7.7L22.2 21h-6.6l-5.2-6.4L4.5 21H2.3l7.2-8.3L2.1 3h6.8l4.7 5.9L18.9 3zm-1.2 16.2h1.8L7.5 4.7H5.6l12.1 14.5z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.4h3.38V8.5zM5.25 3.6a1.96 1.96 0 100 3.92 1.96 1.96 0 000-3.92zM20.4 20.4h-3.37v-6.13c0-1.46-.03-3.35-2.04-3.35-2.04 0-2.36 1.6-2.36 3.24v6.24H9.27V8.5h3.24v1.63h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2v6.84z" />
    </svg>
  );
}
