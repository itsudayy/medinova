import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Stethoscope, UserRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

// Reached only right after a first-time Google sign-in — email/password
// signups collect role on the Register form itself, but Google's popup
// only gives us name/email, so we ask for the one thing still missing.
export default function CompleteProfile() {
  const { firebaseUser, completeGoogleProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: firebaseUser?.displayName || '', role: 'patient', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await completeGoogleProfile(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
          One last step
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Tell us a bit about yourself to finish setting up your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'patient' })}
            className={`flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 transition-all ${
              form.role === 'patient'
                ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <UserRound className="w-5 h-5" />
            <span className="text-sm font-semibold">Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'doctor' })}
            className={`flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 transition-all ${
              form.role === 'doctor'
                ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-sm font-semibold">Doctor</span>
          </button>
        </div>

        <Input
          icon={User}
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          icon={Phone}
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Setting up...' : 'Continue'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>
    </AuthLayout>
  );
}
