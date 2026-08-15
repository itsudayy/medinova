import { HeartPulse, ShieldCheck, Video, CalendarCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const features = [
  { icon: CalendarCheck, text: 'Book appointments with verified specialists in minutes' },
  { icon: Video, text: 'Secure video consultations from anywhere' },
  { icon: ShieldCheck, text: 'HIPAA-conscious data handling & encrypted records' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-700 via-brand-600 to-teal-accent overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
            <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl">
              <HeartPulse className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">MediNova</span>
          </Link>

          <div className="space-y-8">
            <h1 className="font-display text-4xl font-bold leading-tight max-w-md">
              Healthcare, reimagined for everyone.
            </h1>
            <p className="text-brand-100 max-w-sm text-[15px] leading-relaxed">
              Connect with trusted doctors, manage appointments, and access your prescriptions —
              all in one modern platform.
            </p>

            <div className="space-y-4 pt-4">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-brand-50">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-brand-200">© 2026 MediNova. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          {/* The branding panel (with its logo-home link) is hidden below lg,
              so this is the only way back to the landing page on mobile. */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
