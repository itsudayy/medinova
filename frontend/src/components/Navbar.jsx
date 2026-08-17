import { useState, useEffect } from 'react';
import { HeartPulse, LogOut, Crown, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import Button from './ui/Button';

// Active styling comes from NavLink's own isActive, which is derived from the
// router's current location — so it is correct after a hard refresh or a
// direct URL visit, not just after in-app navigation.
const linkClass = ({ isActive }) =>
  [
    'relative py-1 transition-colors',
    isActive
      ? 'text-brand-700 dark:text-brand-400 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand-600 dark:after:bg-brand-400'
      : 'hover:text-slate-900 dark:hover:text-white',
  ].join(' ');

const mobileLinkClass = ({ isActive }) =>
  [
    'block px-3 py-2 rounded-lg transition-colors',
    isActive
      ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 font-semibold'
      : 'hover:bg-slate-50 dark:hover:bg-slate-800',
  ].join(' ');

// One Navbar for the whole app: public visitors (Home/About/Contact + Login/Sign
// up) and signed-in users (role-based app links + avatar + logout) both render
// from here, so the header never looks like two different products.
export default function Navbar() {
  const { firebaseUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isApprovedDoctor = profile?.role === 'doctor' && profile?.status === 'approved';

  // Close the mobile menu whenever the route changes, otherwise it stays open
  // covering the page the user just navigated to.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const publicLinks = (cls) => (
    <>
      <NavLink to="/" end className={cls}>Home</NavLink>
      <NavLink to="/about" className={cls}>About Us</NavLink>
      <NavLink to="/contact" className={cls}>Contact Us</NavLink>
    </>
  );

  const appLinks = (cls) => (
    <>
      <NavLink to="/dashboard" className={cls}>Dashboard</NavLink>
      {profile?.role === 'patient' && (
        <>
          <NavLink to="/doctors" className={cls}>Find a Doctor</NavLink>
          {!profile?.isPremium && (
            <NavLink
              to="/premium"
              className={({ isActive }) =>
                `${cls({ isActive })} flex items-center gap-1 ${
                  isActive ? '' : 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
                }`
              }
            >
              <Crown className="w-3.5 h-3.5" /> Premium
            </NavLink>
          )}
        </>
      )}
      {isApprovedDoctor && <NavLink to="/doctor/profile" className={cls}>My Profile</NavLink>}
      {(profile?.role === 'patient' || isApprovedDoctor) && (
        <NavLink to="/appointments" className={cls}>Appointments</NavLink>
      )}
      {profile?.role === 'admin' && <NavLink to="/admin" className={cls}>Admin</NavLink>}
    </>
  );

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={firebaseUser ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0 group">
            <div className="bg-gradient-to-br from-brand-600 to-teal-accent p-1.5 rounded-lg transition-transform group-hover:scale-105">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">MediNova</span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {firebaseUser ? appLinks(linkClass) : publicLinks(linkClass)}
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
              <Avatar profile={profile} />
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
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {firebaseUser ? appLinks(mobileLinkClass) : publicLinks(mobileLinkClass)}
          </div>

          {firebaseUser ? (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Avatar profile={profile} size="sm" />
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

// Uses the user's photo when they have one (Google sign-ins and seeded doctors
// do), falling back to a gradient initial if it's missing or fails to load.
function Avatar({ profile, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';

  if (profile?.photoURL && !failed) {
    return (
      <img
        src={profile.photoURL}
        alt=""
        onError={() => setFailed(true)}
        className={`${dim} rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white font-semibold shrink-0`}>
      {profile?.name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}
