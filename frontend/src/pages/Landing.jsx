import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, Video, Star, Crown, ArrowRight, Stethoscope, Search,
  Pill, MessageSquareQuote, BadgeCheck, Lock, Clock, Sparkles, Quote, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsTicker from '../components/NewsTicker';
import NoticeBoard from '../components/NoticeBoard';
import Button from '../components/ui/Button';
import SmartImage from '../components/ui/SmartImage';
import DoctorCard from '../components/DoctorCard';
import useReveal from '../hooks/useReveal';
import { fetchDoctors } from '../services/doctorService';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1400&q=80',
  consult: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&q=80',
  clinic: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
  care: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
  tech: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
};

const services = [
  { icon: Video, title: 'Video Consultations', text: 'See a specialist from anywhere — no waiting room, no commute.' },
  { icon: Stethoscope, title: 'In-Person Visits', text: 'Prefer face to face? Book a physical consultation just as easily.' },
  { icon: Pill, title: 'Digital Prescriptions', text: 'Your prescription lands on your account right after your consultation.' },
  { icon: MessageSquareQuote, title: 'Verified Reviews', text: 'Every review comes from a paid, completed consultation — never fabricated.' },
  { icon: Crown, title: 'Premium Membership', text: 'Unlock discount coupons, priority booking, and exclusive seminars.' },
  { icon: CalendarCheck, title: 'Simple Booking', text: 'Pick a doctor, a slot, and a payment method. Done in minutes.' },
];

const whyChoose = [
  { icon: BadgeCheck, title: 'Verified doctors only', text: 'Every doctor is manually reviewed and approved by an admin before they can accept a single booking.', image: IMAGES.care },
  { icon: Lock, title: 'Secure by design', text: 'Payments run through Stripe. Your medical data never touches a third-party ad network.', image: IMAGES.tech },
  { icon: Clock, title: 'Book in minutes', text: 'No phone calls, no hold music — browse, pick a slot, and pay in one flow.', image: IMAGES.clinic },
];

const seminars = [
  { title: 'Preventive Heart Health', description: 'Cardiovascular wellness, exercise routines, and dietary guidance from leading cardiologists.' },
  { title: 'Mental Health & Wellness', description: 'Stress management, meditation techniques, and building a resilient mind.' },
  { title: 'Nutrition for Longevity', description: 'How to eat for optimal health and plan balanced, sustainable meals.' },
  { title: 'Managing Chronic Conditions', description: 'Deep dives into diabetes, hypertension, and other common conditions.' },
];

const testimonials = [
  { name: 'Alex M.', role: 'Patient', text: 'Booking a video consultation took less time than finding a parking spot at my old clinic.' },
  { name: 'Priya R.', role: 'Patient', text: 'I could actually see the doctor’s rating and reviews before booking. That mattered a lot to me.' },
  { name: 'Dr. Amara K.', role: 'Cardiologist', text: 'The dashboard shows my real earnings and ratings — no guessing how my practice is doing.' },
];

export default function Landing() {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorCount, setDoctorCount] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then((d) => {
        setDoctorCount(d.length);
        setDoctors(d.slice(0, 3));
      })
      .catch(() => setDoctorCount(null))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const servicesRef = useReveal();
  const whyRef = useReveal();
  const doctorsRef = useReveal();
  const premiumRef = useReveal();
  const seminarsRef = useReveal();
  const testimonialsRef = useReveal();
  const ctaRef = useReveal();

  const browseTarget = firebaseUser ? '/doctors' : '/register';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <NewsTicker />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={IMAGES.hero}
            alt=""
            eager
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover"
          />
          {/* Readability scrim — text sits on top of the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Now accepting new patients
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
              Healthcare, <span className="text-brand-300">reimagined</span> for everyone.
            </h1>

            <p className="text-slate-200 mt-6 text-lg leading-relaxed max-w-xl">
              Book video or in-person consultations with verified specialists, pay securely, and
              get your prescription online — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={browseTarget}>
                <Button className="text-base px-6 py-3">
                  <Search className="w-4 h-4" /> Find a doctor
                </Button>
              </Link>
              <Link to={firebaseUser ? '/appointments' : '/login'}>
                <Button
                  variant="secondary"
                  className="text-base px-6 py-3 bg-white/10 border-white/25 text-white hover:bg-white/20 dark:bg-white/10 dark:border-white/25 dark:text-white dark:hover:bg-white/20"
                >
                  {firebaseUser ? 'My appointments' : 'I already have an account'}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10 text-sm text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-300" /> Admin-verified doctors</span>
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-brand-300" /> Secure Stripe payments</span>
              {doctorCount !== null && doctorCount > 0 && (
                <span className="flex items-center gap-2"><Stethoscope className="w-4 h-4 text-brand-300" /> {doctorCount} specialists available</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={servicesRef} className="reveal text-center mb-12">
          <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm uppercase tracking-wide mb-2">What we offer</p>
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Our Services</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Everything you need for your healthcare journey, in one place.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, text }) => (
            <ServiceCard key={title} icon={Icon} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* ---------- Why choose + notices ---------- */}
      <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div ref={whyRef} className="reveal text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Why Choose MediNova?</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {whyChoose.map(({ icon: Icon, title, text, image }) => (
              <div
                key={title}
                className="group bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <SmartImage
                  src={image}
                  alt=""
                  wrapperClassName="h-40 w-full"
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-teal-accent mb-4 -mt-10 relative ring-4 ring-slate-50 dark:ring-slate-900">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <NoticeBoard />
        </div>
      </section>

      {/* ---------- Featured doctors ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={doctorsRef} className="reveal flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm uppercase tracking-wide mb-2">Our team</p>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Featured Specialists</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Meet a few of our verified doctors.</p>
          </div>
          <Link
            to={browseTarget}
            className="text-brand-600 dark:text-brand-400 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingDoctors
            ? [0, 1, 2].map((i) => <DoctorCardSkeleton key={i} />)
            : doctors.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  onClick={() => navigate(firebaseUser ? `/doctors/${doc._id}` : '/register')}
                />
              ))}
        </div>
      </section>

      {/* ---------- Premium ---------- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          ref={premiumRef}
          className="reveal relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-teal-accent text-white"
        >
          <div className="absolute inset-0 opacity-20">
            <SmartImage src={IMAGES.consult} alt="" wrapperClassName="h-full w-full" className="h-full w-full object-cover" />
          </div>
          <div className="relative p-10 sm:p-14 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6" />
                <span className="font-display font-bold text-lg">MediNova Premium</span>
              </div>
              <h2 className="font-display text-3xl font-bold leading-tight">Unlock more from every visit.</h2>
              <p className="text-brand-50 mt-3 leading-relaxed">
                One-time membership, one full year of benefits: discount coupons, priority booking,
                and access to exclusive health seminars.
              </p>
              <Link to={firebaseUser ? '/premium' : '/register'} className="inline-block mt-6">
                <Button variant="secondary" className="text-slate-900 px-6 py-3">
                  Explore Premium <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Discount coupons', 'Priority booking', 'Health seminars', '1 year validity'].map((b) => (
                <div key={b} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-medium border border-white/10">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Seminars ---------- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div ref={seminarsRef} className="reveal text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Health Programs & Seminars</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            A Premium membership perk — free to attend once you're a member.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {seminars.map(({ title, description }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-md dark:hover:shadow-none transition-all"
            >
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div ref={testimonialsRef} className="reveal text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">What People Say</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Illustrative feedback for demo purposes</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div
                key={name}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300"
              >
                <Quote className="w-6 h-6 text-brand-300 dark:text-brand-500/50 mb-3" />
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-sm font-semibold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={ctaRef} className="reveal relative overflow-hidden rounded-2xl">
          <SmartImage src={IMAGES.clinic} alt="" wrapperClassName="absolute inset-0 h-full w-full" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="relative p-10 sm:p-16 text-center text-white">
            <h2 className="font-display text-3xl font-bold">Ready to get started?</h2>
            <p className="text-slate-300 mt-2 max-w-md mx-auto">
              Create your free account and book your first consultation today.
            </p>
            <Link to={browseTarget} className="inline-block mt-6">
              <Button variant="secondary" className="text-slate-900 px-6 py-3 text-base">
                {firebaseUser ? 'Find a doctor' : 'Create your account'} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon: Icon, title, text }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6
        hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none
        hover:border-brand-300 dark:hover:border-brand-500/40 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function DoctorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="h-44 bg-slate-100 dark:bg-slate-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}
