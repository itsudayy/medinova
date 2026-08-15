import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { confirmPremium } from '../services/premiumService';
import { useAuth } from '../context/AuthContext';

export default function PremiumConfirm() {
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking'); // checking | success | failed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      setLoading(false);
      return;
    }
    confirmPremium(sessionId)
      .then(async (data) => {
        setStatus(data.isPremium ? 'success' : 'failed');
        if (data.isPremium) await refreshProfile(); // so navbar/dashboard update immediately
      })
      .catch(() => setStatus('failed'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="max-w-md mx-auto px-6 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Confirming your premium upgrade...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Welcome to Premium!</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Your upgrade is complete. Premium-only coupons, exclusive seminars, and priority booking are now unlocked.
              </p>
              <Link to="/dashboard">
                <Button className="mt-6">Go to Dashboard</Button>
              </Link>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Payment not confirmed</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Something went wrong, or the payment wasn't completed. No charge was made if you cancelled.
              </p>
              <Link to="/premium">
                <Button variant="secondary" className="mt-6">
                  Back to Premium
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
