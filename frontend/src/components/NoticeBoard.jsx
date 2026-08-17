import { Info, Wrench, CalendarPlus, Sparkles } from 'lucide-react';

// Static informational content — intentionally frontend-only, no API needed.
const NOTICES = [
  {
    icon: CalendarPlus,
    tone: 'brand',
    title: 'New appointment slots',
    text: 'Additional weekday and Saturday slots have been released across all specialities.',
  },
  {
    icon: Sparkles,
    tone: 'emerald',
    title: 'Digital prescriptions',
    text: 'Your prescription now appears on your appointment right after the consultation ends.',
  },
  {
    icon: Wrench,
    tone: 'amber',
    title: 'Scheduled maintenance',
    text: 'Booking may be briefly unavailable on Sunday between 02:00 and 04:00.',
  },
];

const TONES = {
  brand: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export default function NoticeBoard({ className = '' }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <Info className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <h3 className="font-display font-semibold text-slate-900 dark:text-white">Important notices</h3>
      </div>

      <div className="space-y-4">
        {NOTICES.map(({ icon: Icon, tone, title, text }) => (
          <div key={title} className="flex gap-3">
            <div className={`${TONES[tone]} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm">{title}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-0.5">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
