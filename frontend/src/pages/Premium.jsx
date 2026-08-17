import { useState } from 'react';
import { Crown, Check, Zap, Users, Calendar, BookOpen, Ticket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { createPremiumCheckout } from '../services/premiumService';
import { useAuth } from '../context/AuthContext';

const benefits = [
  { icon: Ticket, text: 'Exclusive premium-only discount coupons' },
  { icon: Users, text: 'Access to exclusive health seminars' },
  { icon: BookOpen, text: 'Personalized health programs' },
  { icon: Zap, text: 'Priority appointment booking' },
  { icon: Calendar, text: 'Member pricing on video consultations' },
  { icon: Check, text: 'Membership valid for 1 full year' },
];

const seminars = [
  {
    title: 'Preventive Heart Health',
    description: 'Learn about cardiovascular wellness, exercise routines, and dietary guidelines from leading cardiologists.',
  },
  {
    title: 'Mental Health & Wellness',
    description: 'Expert-led sessions on stress management, meditation techniques, and building a resilient mind.',
  },
  {
    title: 'Nutrition for Longevity',
    description: 'Discover how to eat for optimal health, understand macro/micronutrients, and plan balanced meals.',
  },
  {
    title: 'Managing Chronic Conditions',
    description: 'Deep dives into managing diabetes, hypertension, and other common conditions with expert medical guidance.',
  },
];

export default function Premium() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPremium = profile?.isPremium;

  async function handleUpgrade() {
    setError('');
    setLoading(true);
    try {
      const { checkoutUrl } = await createPremiumCheckout();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {isPremium ? (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-8 text-center mb-12">
            <Crown className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-emerald-900 dark:text-emerald-300">You're a Premium Member!</h1>
            <p className="text-emerald-700 dark:text-emerald-400 mt-2">
              Premium-only coupons, priority booking, and the seminars & programs below are all unlocked.
            </p>
            {profile?.premiumSince && (
              <p className="text-emerald-600/80 dark:text-emerald-400/70 text-sm mt-1">
                Member since {new Date(profile.premiumSince).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-amber-500" />
                <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">MediNova Premium</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Upgrade to Premium and unlock exclusive benefits, priority access to doctors, and personalized health programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-6">What's Included</h2>
                <div className="space-y-4">
                  {benefits.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="text-brand-600 dark:text-brand-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-8 text-white flex flex-col justify-center">
                <p className="text-5xl font-display font-bold mb-2">$99.99</p>
                <p className="text-brand-100 text-sm mb-6">One-time payment for 1 year of premium access</p>
                {error && <p className="text-red-200 text-sm mb-4">{error}</p>}
                <Button variant="secondary" onClick={handleUpgrade} disabled={loading} className="w-full text-slate-900">
                  {loading ? 'Redirecting...' : 'Upgrade to Premium'}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Seminars stay visible to everyone: a selling point before joining,
            and the actual member content afterwards. */}
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">Exclusive Seminars & Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {seminars.map(({ title, description }) => (
              <div key={title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
