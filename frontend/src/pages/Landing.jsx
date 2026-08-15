import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Video, Star, Crown, ArrowRight, Stethoscope, Search,
  Pill, MessageSquareQuote, BadgeCheck, Lock, Clock, Sparkles, Quote,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import DoctorCard from '../components/DoctorCard';
import useReveal from '../hooks/useReveal';
import { fetchDoctors } from '../services/doctorService';

const services = [
  { icon: Video, title: 'Video Consultations', text: 'See a specialist from anywhere — no waiting room, no commute.' },
  { icon: Stethoscope, title: 'In-Person Visits', text: 'Prefer face to face? Book a physical consultation just as easily.' },
  { icon: Pill, title: 'Digital Prescriptions', text: 'Your prescription lands on your account right after your consultation.' },
  { icon: MessageSquareQuote, title: 'Verified Reviews', text: 'Every review comes from a paid, completed consultation — never fabricated.' },
  { icon: Crown, title: 'Premium Membership', text: 'Unlock discount coupons, priority booking, and exclusive seminars.' },
  { icon: CalendarCheck, title: 'Simple Booking', text: 'Pick a doctor, a slot, and a payment method. Done in minutes.' },
];

const whyChoose = [
  { icon: BadgeCheck, title: 'Verified doctors only', text: 'Every doctor is manually reviewed and approved by an admin before they can accept a single booking.' },
  { icon: Lock, title: 'Secure by design', text: 'Payments run through Stripe. Your medical data never touches a third-party ad network.' },
  { icon: Clock, title: 'Book in minutes', text: 'No phone calls, no hold music — browse, pick a slot, and pay in one flow.' },
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

  useEffect(() => {
    fetchDoctors()
      .then((d) => {
        setDoctorCount(d.length);
        setDoctors(d.slice(0, 3));
      })
      .catch(() => setDoctorCount(null));
  }, []);

  const heroRef = useReveal();
  const statsRef = useReveal();
  const servicesRef = useReveal();
  const whyRef = useReveal();
  const doctorsRef = useReveal();
  const premiumRef = useReveal();
  const seminarsRef = useReveal();
  const testimonialsRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div ref={heroRef} className="reveal">
          <div className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Now accepting new patients
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Healthcare, <span className="text-brand-600 dark:text-brand-400">reimagined</span> for everyone.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-5 text-lg leading-relaxed max-w-lg">
            Connect with verified doctors, book video or in-person consultations, and pay
            securely — all in one modern platform.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link to={firebaseUser ? '/doctors' : '/register'}>
              <Button className="text-base px-6 py-3">
                <Search className="w-4 h-4" /> Find a doctor
              </Button>
            </Link>
            {!firebaseUser && (
              <Link to="/login">
                <Button variant="secondary" className="text-base px-6 py-3">
                  I already have an account
                </Button>
              </Link>
            )}
          </div>

          {doctorCount !== null && (
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-6">
              {doctorCount > 0 ? `${doctorCount} verified specialist${doctorCount !== 1 ? 's' : ''} ready to see you.` : 'Building our network of specialists.'}
            </p>
          )}
        </div>

        <div className="relative reveal" ref={statsRef}>
          <div className="absolute -inset-6 bg-gradient-to-br from-brand-500/20 to-teal-accent/20 rounded-[2rem] blur-2xl" />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Dr Sarah Chen</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cardiologist · 5 yrs experience</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.5
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Video className="w-4 h-4" /> Video consultation</span>
              <span className="font-semibold text-slate-900 dark:text-white">$75</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Stethoscope className="w-4 h-4" /> Physical visit</span>
              <span className="font-semibold text-slate-900 dark:text-white">$80</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Premium members save with exclusive coupons
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: BadgeCheck, label: 'Admin-verified doctors' },
            { icon: Lock, label: 'Secure Stripe payments' },
            { icon: MessageSquareQuote, label: 'Genuine patient reviews' },
            { icon: Clock, label: 'Book in under 2 minutes' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={servicesRef} className="reveal text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Our Services</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">Everything you need for your healthcare journey, in one place.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, text }) => (
            <ServiceCard key={title} icon={Icon} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div ref={whyRef} className="reveal text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Why Choose MediNova?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {whyChoose.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-accent mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured doctors */}
      {doctors.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div ref={doctorsRef} className="reveal flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Featured Specialists</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Meet a few of our verified doctors.</p>
            </div>
            <Link to={firebaseUser ? '/doctors' : '/register'} className="text-brand-600 dark:text-brand-400 font-medium text-sm flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} onClick={() => navigate(firebaseUser ? `/doctors/${doc._id}` : '/register')} />
            ))}
          </div>
        </section>
      )}

      {/* Premium */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={premiumRef} className="reveal bg-gradient-to-br from-brand-600 to-teal-accent rounded-2xl p-10 sm:p-14 text-white grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6" />
              <span className="font-display font-bold text-lg">MediNova Premium</span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight">Unlock more from every visit.</h2>
            <p className="text-brand-100 mt-3 leading-relaxed">
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
              <div key={b} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-medium">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Health programs */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div ref={seminarsRef} className="reveal text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Health Programs & Seminars</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">A Premium membership perk — free to attend once you're a member.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {seminars.map(({ title, description }) => (
            <div key={title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div ref={testimonialsRef} className="reveal text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">What People Say</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Illustrative feedback for demo purposes</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
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

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div ref={ctaRef} className="reveal bg-gradient-to-br from-slate-900 to-slate-800 dark:from-brand-700 dark:to-teal-accent rounded-2xl p-10 sm:p-14 text-center text-white">
          <h2 className="font-display text-3xl font-bold">Ready to get started?</h2>
          <p className="text-slate-300 dark:text-brand-100 mt-2 max-w-md mx-auto">
            Create your free account and book your first consultation today.
          </p>
          <Link to={firebaseUser ? '/doctors' : '/register'} className="inline-block mt-6">
            <Button variant="secondary" className="text-slate-900 px-6 py-3 text-base">
              {firebaseUser ? 'Find a doctor' : 'Create your account'} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon: Icon, title, text }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md dark:hover:shadow-none dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all">
      <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
