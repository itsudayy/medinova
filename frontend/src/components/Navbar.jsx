import { useState } from 'react';
import { HeartPulse, LogOut, Crown, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import Button from './ui/Button';

// One Navbar for the whole app: public visitors (Home/About/Contact + Login/Sign
// up) and signed-in users (role-based app links + avatar + logout) both render
// from here, so the header never looks like two different products.
export default function Navbar() {
  const { firebaseUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isApprovedDoctor = profile?.role === 'doctor' && profile?.status === 'approved';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const publicLinks = (
    <>
      <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
      <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link>
      <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Us</Link>
    </>
  );

  const appLinks = (
    <>
      <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
      {profile?.role === 'patient' && (
        <>
          <Link to="/doctors" className="hover:text-slate-900 dark:hover:text-white transition-colors">Find a Doctor</Link>
          {!profile?.isPremium && (
            <Link to="/premium" className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
              <Crown className="w-3.5 h-3.5" /> Premium
            </Link>
          )}
        </>
      )}
      {isApprovedDoctor && (
        <Link to="/doctor/profile" className="hover:text-slate-900 dark:hover:text-white transition-colors">My Profile</Link>
      )}
      {(profile?.role === 'patient' || isApprovedDoctor) && (
        <Link to="/appointments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Appointments</Link>
      )}
      {profile?.role === 'admin' && (
        <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admin</Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={firebaseUser ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-brand-600 to-teal-accent p-1.5 rounded-lg">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">MediNova</span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {firebaseUser ? appLinks : publicLinks}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {firebaseUser ? (
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{profile?.name}</p>
                {profile?.isPremium ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium leading-tight flex items-center gap-1 justify-end">
                    <Crown className="w-3 h-3" /> Premium
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize leading-tight">{profile?.role}</p>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            {firebaseUser ? appLinks : publicLinks}
          </div>

          {firebaseUser ? (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-xs font-semibold">
                  {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{profile?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 font-medium"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" className="w-full">Log in</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
