import { HeartPulse, ShieldCheck, Users, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useReveal from '../hooks/useReveal';

const values = [
  { icon: Target, title: 'Our Mission', text: 'Make quality healthcare easy to find, easy to book, and easy to trust — for every patient and every doctor.' },
  { icon: ShieldCheck, title: 'Verified Care', text: 'Every doctor on MediNova is reviewed and approved before they can see a single patient.' },
  { icon: Users, title: 'Built for Both Sides', text: 'Patients get simple booking and honest reviews. Doctors get real earnings visibility and manageable schedules.' },
];

export default function About() {
  const heroRef = useReveal();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
          <div ref={heroRef} className="reveal">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-accent mb-6">
              <HeartPulse className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              About MediNova
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
              MediNova is a portfolio demo of a modern healthcare booking platform — built to show
              what a real, production-quality patient-and-doctor experience looks like end to end.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, text }) => (
              <ValueCard key={title} icon={Icon} title={title} text={text} />
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">How it works</h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <li><span className="font-semibold text-slate-900 dark:text-white">1. Find a specialist —</span> browse verified doctors by specialization, experience, and real patient ratings.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">2. Book & pay securely —</span> choose a video or in-person consultation and pay through Stripe.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">3. Get care & follow-up —</span> receive your digital prescription and leave a review once your consultation is complete.</li>
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ValueCard({ icon: Icon, title, text }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md dark:hover:shadow-none dark:hover:border-slate-700 transition-all">
      <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
