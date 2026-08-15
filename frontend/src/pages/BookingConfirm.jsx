import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { confirmBooking } from '../services/appointmentService';

export default function BookingConfirm() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking'); // checking | paid | failed
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }
    confirmBooking(sessionId)
      .then((data) => {
        setAppointment(data);
        setStatus(data.paymentStatus === 'paid' ? 'paid' : 'failed');
      })
      .catch(() => setStatus('failed'));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          {status === 'checking' && (
            <>
              <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Confirming your payment...</h1>
            </>
          )}

          {status === 'paid' && (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Appointment confirmed!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                {appointment?.type === 'video' ? 'Video' : 'Physical'} consultation on {appointment?.date} (
                {appointment?.timeRange})
              </p>
              <Link to="/appointments">
                <Button className="mt-6">View my appointments</Button>
              </Link>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Payment not confirmed</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Something went wrong, or the payment wasn't completed. No charge was made if you cancelled.
              </p>
              <Link to="/doctors">
                <Button variant="secondary" className="mt-6">
                  Back to doctors
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
