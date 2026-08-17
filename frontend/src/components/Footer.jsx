import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from './ui/SocialIcons';

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Find Doctors', to: '/doctors' },
      { label: 'Appointments', to: '/appointments' },
      { label: 'Premium Membership', to: '/premium' },
    ],
  },
];

const socials = [
  { icon: FacebookIcon, label: 'Facebook' },
  { icon: TwitterIcon, label: 'Twitter' },
  { icon: InstagramIcon, label: 'Instagram' },
  { icon: LinkedinIcon, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-brand-600 to-teal-accent p-1.5 rounded-lg">
                <HeartPulse className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">MediNova</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              A modern healthcare platform connecting patients with verified doctors for video and
              in-person consultations.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400
                    hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400
                    flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> support@medinova.demo</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> (555) 010-0123</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> 100 Wellness Ave, Suite 4</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center">
          © 2026 MediNova. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
