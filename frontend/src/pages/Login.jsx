import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GoogleIcon from '../components/ui/GoogleIcon';
import authErrorMessage from '../utils/authError';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setGoogleLoading(true);
    try {
      const { redirecting } = await loginWithGoogle();
      if (!redirecting) navigate('/dashboard'); // a redirect reloads the page itself
    } catch (err) {
      // A user closing the Google popup isn't an error worth surfacing.
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(authErrorMessage(err));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Log in to manage your appointments and care.</p>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm py-2.5
          hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon /> {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400 dark:text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Input icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Input icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Logging in...' : 'Log In'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>

        <p className="text-sm text-center text-slate-500 dark:text-slate-400 pt-2">
          No account?{' '}
          <Link to="/register" className="text-brand-700 dark:text-brand-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
