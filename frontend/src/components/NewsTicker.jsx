import { Megaphone } from 'lucide-react';

// Static announcements — no backend needed for this.
const ANNOUNCEMENTS = [
  'New appointment slots released for next week',
  'Dr Elena Rossi now accepting Saturday consultations',
  'Premium members get exclusive discount coupons',
  'Scheduled maintenance: Sunday 02:00–04:00',
  'Digital prescriptions now available right after your consultation',
  'New specialists joining MediNova this month',
];

/**
 * Horizontal auto-scrolling announcement bar.
 *
 * The list is rendered twice inside a single track: when the first copy has
 * scrolled fully out of view the second copy sits exactly where the first
 * began, so resetting to 0% is invisible and the loop looks continuous.
 * Pauses on hover, and respects prefers-reduced-motion (see index.css).
 */
export default function NewsTicker() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="relative flex items-center gap-3 bg-brand-600 dark:bg-brand-700 text-white overflow-hidden">
      <div className="flex items-center gap-2 pl-4 sm:pl-6 py-2.5 shrink-0 z-10 bg-brand-600 dark:bg-brand-700">
        <Megaphone className="w-4 h-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide hidden sm:inline">Updates</span>
      </div>

      {/* Fade so text doesn't hard-clip against the label */}
      <div className="absolute left-[88px] sm:left-[132px] top-0 bottom-0 w-8 bg-gradient-to-r from-brand-600 dark:from-brand-700 to-transparent z-10 pointer-events-none" />

      <div className="marquee flex-1 overflow-hidden py-2.5">
        <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
          {items.map((text, i) => (
            <span key={i} className="text-sm text-brand-50 flex items-center gap-10">
              {text}
              <span className="w-1.5 h-1.5 rounded-full bg-brand-200/70 shrink-0" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
