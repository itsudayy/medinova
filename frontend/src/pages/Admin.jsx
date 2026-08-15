import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Stethoscope } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { bootstrapAdmin, fetchDoctorUsers, setDoctorStatus } from '../services/userService';

const STATUS_STYLES = {
  approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
  pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
  rejected: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20',
};

export default function Admin() {
  const { profile, refreshProfile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" /> Admin
        </h1>
        {isAdmin ? <DoctorApprovalPanel /> : <BootstrapAdminPanel onBootstrapped={refreshProfile} />}
      </main>
    </div>
  );
}

// Shown to a signed-in, non-admin user. Promotes their own account to admin
// once, using the shared secret — the same one-time-setup pattern already
// used for the initial doctor approval flow.
function BootstrapAdminPanel({ onBootstrapped }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBootstrap() {
    setError('');
    setLoading(true);
    try {
      await bootstrapAdmin(secret);
      await onBootstrapped();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md">
      <ShieldAlert className="w-8 h-8 text-amber-500 mb-3" />
      <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-1">Not an admin yet</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
        Enter the admin setup secret to promote your signed-in account to admin. This only needs to happen once.
      </p>
      <Input
        type="password"
        placeholder="Admin setup secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-3">{error}</p>}
      <Button onClick={handleBootstrap} disabled={loading || !secret} className="mt-4 w-full">
        {loading ? 'Verifying...' : 'Become Admin'}
      </Button>
    </div>
  );
}

// Shown to a real admin. All requests here are authorized by the signed-in
// user's role (checked server-side by requireAdmin) — no secret involved.
function DoctorApprovalPanel() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setDoctors(await fetchDoctorUsers());
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    setUpdatingId(id);
    try {
      const updated = await setDoctorStatus(id, status);
      setDoctors((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const pending = doctors.filter((d) => d.status === 'pending');
  const others = doctors.filter((d) => d.status !== 'pending');

  return (
    <div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-slate-400 dark:text-slate-500">Loading...</p>}

      {!loading && doctors.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500 dark:text-slate-400">
          No doctor accounts yet.
        </div>
      )}

      {!loading && pending.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-3">Pending approval ({pending.length})</h2>
          <div className="space-y-3 mb-8">
            {pending.map((d) => (
              <DoctorRow key={d._id} doctor={d} updating={updatingId === d._id} onStatus={handleStatus} />
            ))}
          </div>
        </>
      )}

      {!loading && others.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-3">All doctors</h2>
          <div className="space-y-3">
            {others.map((d) => (
              <DoctorRow key={d._id} doctor={d} updating={updatingId === d._id} onStatus={handleStatus} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DoctorRow({ doctor, updating, onStatus }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
      <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl shrink-0">
        <Stethoscope className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white truncate">{doctor.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{doctor.email}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border shrink-0 ${STATUS_STYLES[doctor.status]}`}>
        {doctor.status}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {doctor.status !== 'approved' && (
          <Button variant="secondary" disabled={updating} onClick={() => onStatus(doctor._id, 'approved')}>
            <Check className="w-4 h-4" /> Approve
          </Button>
        )}
        {doctor.status !== 'rejected' && (
          <Button variant="danger" disabled={updating} onClick={() => onStatus(doctor._id, 'rejected')}>
            <X className="w-4 h-4" /> Reject
          </Button>
        )}
      </div>
    </div>
  );
}
