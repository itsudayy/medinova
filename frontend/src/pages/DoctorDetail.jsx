import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, ArrowLeft, Video, Building2, Tag, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StarRating from '../components/ui/StarRating';
import SmartImage from '../components/ui/SmartImage';
import DoctorReviews from '../components/DoctorReviews';
import { fetchDoctorById } from '../services/doctorService';
import { createAppointment, checkCoupon } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = () => new Date().toISOString().slice(0, 10);

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [type, setType] = useState('video');
  const [date, setDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [booking, setBooking] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, type, value }
  const [couponError, setCouponError] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  useEffect(() => {
    fetchDoctorById(id)
      .then(setDoctor)
      .catch(() => setError('Doctor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const availableDays = doctor?.availability?.map((s) => s.day) || [];
  const chosenDay = date ? DAY_NAMES[new Date(`${date}T00:00:00`).getDay()] : null;
  const dayIsAvailable = !date || availableDays.includes(chosenDay);
  const fee = type === 'video' ? doctor?.videoFee : doctor?.physicalFee;
  // Client-side preview only — the real discount is recomputed server-side at booking time.
  const previewDiscount = coupon
    ? Math.min(coupon.type === 'percent' ? (fee * coupon.value) / 100 : coupon.value, fee)
    : 0;
  const previewTotal = Math.round((fee - previewDiscount) * 100) / 100;

  async function handleApplyCoupon() {
    setCouponError('');
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    try {
      const data = await checkCoupon(couponInput.trim());
      setCoupon(data);
    } catch (err) {
      setCoupon(null);
      setCouponError(err.response?.data?.message || err.message);
    } finally {
      setCheckingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setCoupon(null);
    setCouponInput('');
    setCouponError('');
  }

  async function handleBook() {
    setBookingError('');
    if (!date) return setBookingError('Please choose a date.');
    if (!dayIsAvailable) return setBookingError(`Doctor is not available on ${chosenDay}s.`);

    setBooking(true);
    try {
      const { checkoutUrl } = await createAppointment({
        doctorId: id,
        type,
        date,
        couponCode: coupon?.code,
      });
      // Fully-discounted bookings skip Stripe and are already confirmed.
      if (checkoutUrl) window.location.href = checkoutUrl;
      else navigate('/appointments');
    } catch (err) {
      setBookingError(err.response?.data?.message || err.message);
      setBooking(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to doctors
        </button>

        {loading && <p className="text-slate-400 dark:text-slate-500">Loading...</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {doctor && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex items-start gap-5">
              {doctor.user?.photoURL ? (
                <SmartImage
                  src={doctor.user.photoURL}
                  alt={doctor.user?.name || 'Doctor'}
                  wrapperClassName="w-20 h-20 rounded-2xl shrink-0"
                  className="w-20 h-20 object-cover rounded-2xl"
                  fallback={
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-2xl font-semibold shrink-0">
                      {doctor.user?.name?.[0]?.toUpperCase() || 'D'}
                    </div>
                  }
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-2xl font-semibold shrink-0">
                  {doctor.user?.name?.[0]?.toUpperCase() || 'D'}
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{doctor.user?.name}</h1>
                <p className="text-brand-600 dark:text-brand-400 font-medium">{doctor.specialization}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> {doctor.experienceYears} years experience
              </span>
              <span className="flex items-center gap-1.5">
                <StarRating value={Math.round(doctor.ratingAverage)} size="sm" />
                {doctor.ratingCount > 0
                  ? `${doctor.ratingAverage.toFixed(1)} (${doctor.ratingCount})`
                  : 'No ratings yet'}
              </span>
            </div>

            {doctor.bio && <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">{doctor.bio}</p>}

            {doctor.availability?.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Availability
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability.map((slot, i) => (
                    <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                      {slot.day} {slot.startTime}–{slot.endTime}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.role === 'patient' ? (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Book an appointment</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setType('video')}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all ${
                      type === 'video'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-semibold">Video · ${doctor.videoFee}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('physical')}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all ${
                      type === 'physical'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">Physical · ${doctor.physicalFee}</span>
                  </button>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Choose a date</label>
                <Input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
                {date && !dayIsAvailable && (
                  <p className="text-amber-600 dark:text-amber-400 text-xs mt-1.5">
                    Not available on {chosenDay}s. Available: {availableDays.join(', ')}
                  </p>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Coupon code (optional)</label>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-2.5">
                      <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                        <Tag className="w-4 h-4" />
                        {coupon.code} · {coupon.type === 'percent' ? `${coupon.value}% off` : `$${coupon.value} off`}
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. HEALTH20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleApplyCoupon}
                        disabled={checkingCoupon || !couponInput.trim()}
                      >
                        {checkingCoupon ? 'Checking...' : 'Apply'}
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{couponError}</p>}
                  {!profile?.isPremium && !coupon && (
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5">Coupon codes are a Premium member benefit.</p>
                  )}
                </div>

                {coupon && (
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Fee</span>
                      <span>${fee}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span>-${previewDiscount}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Total</span>
                      <span>${previewTotal}</span>
                    </div>
                  </div>
                )}

                {bookingError && <p className="text-red-600 dark:text-red-400 text-sm mt-3">{bookingError}</p>}

                <Button onClick={handleBook} disabled={booking} className="mt-5 w-full sm:w-auto">
                  {booking ? 'Redirecting to payment...' : `Book & Pay $${coupon ? previewTotal : fee}`}
                </Button>
              </div>
            ) : (
              <Button className="mt-8 w-full sm:w-auto" disabled>
                Only patients can book appointments
              </Button>
            )}

            <DoctorReviews
              doctorId={doctor._id}
              ratingAverage={doctor.ratingAverage}
              ratingCount={doctor.ratingCount}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
