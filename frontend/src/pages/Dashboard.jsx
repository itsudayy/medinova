import { useEffect, useState } from 'react';
import { CalendarClock, Stethoscope, Star, Sparkles, Clock3, Search, UserCog, DollarSign, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StarRating from '../components/ui/StarRating';
import { fetchPatientStats, fetchDoctorStats } from '../services/appointmentService';

export default function Dashboard() {
  const { profile } = useAuth();
  const isPendingDoctor = profile?.role === 'doctor' && profile?.status === 'pending';
  const isApprovedDoctor = profile?.role === 'doctor' && profile?.status === 'approved';
  const isPatient = profile?.role === 'patient';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPatient && !isApprovedDoctor) {
      setLoading(false);
      return;
    }
    const fetcher = isApprovedDoctor ? fetchDoctorStats : fetchPatientStats;
    fetcher()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [isApprovedDoctor, isPatient]);

  const patientCards = stats && [
    { icon: CalendarClock, label: 'Upcoming appointments', value: stats.upcomingAppointments },
    { icon: Stethoscope, label: 'Doctors visited', value: stats.doctorsVisited },
    { icon: MessageSquareQuote, label: 'Reviews written', value: stats.reviewsWritten },
  ];

  const doctorCards = stats && [
    { icon: CalendarClock, label: 'Upcoming appointments', value: stats.upcomingAppointments },
    { icon: Stethoscope, label: 'Total patients', value: stats.totalPatients },
    { icon: DollarSign, label: 'Total earnings', value: `$${stats.totalEarnings}` },
  ];

  const cards = isApprovedDoctor ? doctorCards : isPatient ? patientCards : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {profile?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {profile?.role === 'doctor'
              ? "Here's an overview of your practice today."
              : profile?.role === 'admin'
              ? 'Manage doctor applications and keep the platform running smoothly.'
              : "Here's an overview of your health journey."}
          </p>
        </div>

        {isPendingDoctor && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 flex items-start gap-4 mb-8">
            <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl shrink-0">
              <Clock3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-amber-900 dark:text-amber-300">Your doctor account is pending approval</h2>
              <p className="text-amber-700/90 dark:text-amber-400/80 text-sm mt-0.5">
                We're reviewing your credentials. You'll be able to create a profile and accept
                appointments once approved — this usually takes a short while.
              </p>
            </div>
          </div>
        )}

        {cards && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {cards.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 hover:shadow-md dark:hover:shadow-none dark:hover:border-slate-700 transition-all"
              >
                <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                    {loading ? '—' : value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isApprovedDoctor && !loading && stats && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4 mb-8">
            <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-500 p-3 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  {stats.ratingCount > 0 ? stats.ratingAverage.toFixed(1) : '—'}
                </p>
                <StarRating value={Math.round(stats.ratingAverage)} size="sm" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stats.ratingCount > 0 ? `From ${stats.ratingCount} patient review${stats.ratingCount !== 1 ? 's' : ''}` : 'No reviews yet'}
              </p>
            </div>
          </div>
        )}

        {isPatient && (
          <Link
            to="/doctors"
            className="flex items-center justify-between gap-6 flex-wrap bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-8 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Find a doctor</h2>
                <p className="text-brand-100 text-sm mt-0.5">Browse verified specialists and book a consultation.</p>
              </div>
            </div>
          </Link>
        )}

        {isApprovedDoctor && (
          <Link
            to="/doctor/profile"
            className="flex items-center justify-between gap-6 flex-wrap bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-8 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <UserCog className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Manage your profile</h2>
                <p className="text-brand-100 text-sm mt-0.5">Update specialization, fee, and availability.</p>
              </div>
            </div>
          </Link>
        )}

        {profile?.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center justify-between gap-6 flex-wrap bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-8 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Review doctor applications</h2>
                <p className="text-brand-100 text-sm mt-0.5">Approve or reject pending doctor accounts.</p>
              </div>
            </div>
          </Link>
        )}

        {!isApprovedDoctor && !isPendingDoctor && profile?.role !== 'patient' && profile?.role !== 'admin' && (
          <div className="bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-8 text-white flex items-center gap-4">
            <div className="bg-white/15 p-3 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">More features on the way</h2>
              <p className="text-brand-100 text-sm mt-0.5">Appointment booking, video consultations & prescriptions coming next.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
