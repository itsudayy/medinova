import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const info = [
  { icon: Mail, label: 'Email', value: 'support@medinova.demo' },
  { icon: Phone, label: 'Phone', value: '(555) 010-0123' },
  { icon: MapPin, label: 'Address', value: '100 Wellness Ave, Suite 4' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  // Demo project — no backend endpoint to send this to. Submitting just
  // confirms client-side validation and shows a success state.
  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Questions about MediNova? Send a message and we'll get back to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h2 className="font-display font-semibold text-slate-900 dark:text-white text-lg">Message sent</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                    Thanks for reaching out — this is a demo form, so nothing was actually sent.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Your message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                      text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none
                      focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
                  />
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4" /> Send message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
