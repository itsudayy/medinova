import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Video, Building2, Tag, CalendarX } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/ui/StarRating';
import ReviewForm, { SubmittedReview } from '../components/ReviewForm';
import PrescriptionForm, { PrescriptionView } from '../components/PrescriptionForm';
import { fetchMyAppointments, fetchMyDoctorAppointments } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  confirmed: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
  pending_payment: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
  completed: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  cancelled: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20',
};

// Mirrors the server's rules so we don't offer a form the API would reject.
// The server still re-checks all of this — this is purely to keep the UI honest.
function canReview(appt) {
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local
  return appt.paymentStatus === 'paid' && appt.status !== 'cancelled' && appt.date <= todayStr;
}

// No date check here (unlike canReview): a doctor may reasonably want to
// write the prescription right away, same day as the confirmed booking.
function canPrescribe(appt) {
  return appt.paymentStatus === 'paid' && appt.status !== 'cancelled';
}

export default function MyAppointments() {
  const { profile } = useAuth();
  const isDoctor = profile?.role === 'doctor';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = isDoctor ? fetchMyDoctorAppointments : fetchMyAppointments;
    fetcher()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [isDoctor]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">My Appointments</h1>

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <CalendarX className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="font-display font-semibold text-slate-900 dark:text-white">No appointments yet</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isDoctor
                ? 'Bookings from patients will appear here.'
                : 'Book your first consultation to get started.'}
            </p>
            {!isDoctor && (
              <Link
                to="/doctors"
                className="inline-block mt-5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                Find a doctor →
              </Link>
            )}
          </div>
        )}

        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 transition-shadow hover:shadow-sm dark:hover:shadow-none dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl shrink-0">
                  {appt.type === 'video' ? <Video className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {isDoctor ? appt.patient?.name : appt.doctor?.user?.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <CalendarClock className="w-3.5 h-3.5" />
                    {appt.date} · {appt.timeRange} · {appt.type}
                  </p>
                  {appt.couponCode && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                      <Tag className="w-3 h-3" />
                      {appt.couponCode} · saved ${appt.discountAmount}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900 dark:text-white">${appt.amountPaid}</p>
                  {appt.discountAmount > 0 && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-through">${appt.fee}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border shrink-0 ${STATUS_STYLES[appt.status]}`}>
                  {appt.status.replace('_', ' ')}
                </span>
              </div>

              {/* Patients rate their own past consultations; doctors just see the result. */}
              {isDoctor
                ? appt.rating && (
                    <div className="mt-3 flex items-center gap-2">
                      <StarRating value={appt.rating} size="sm" />
                      {appt.review && <span className="text-sm text-slate-600 dark:text-slate-300">“{appt.review}”</span>}
                    </div>
                  )
                : appt.rating
                ? <SubmittedReview appointment={appt} />
                : canReview(appt) && (
                    <ReviewForm
                      appointment={appt}
                      onReviewed={(updated) =>
                        setAppointments((prev) => prev.map((a) => (a._id === updated._id ? { ...a, ...updated } : a)))
                      }
                    />
                  )}

              {/* Doctors write/edit; patients get a read-only view once one exists. */}
              {isDoctor
                ? canPrescribe(appt) && (
                    <PrescriptionForm
                      appointment={appt}
                      onSaved={(updated) =>
                        setAppointments((prev) => prev.map((a) => (a._id === updated._id ? { ...a, ...updated } : a)))
                      }
                    />
                  )
                : <PrescriptionView appointment={appt} />}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
