import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { firebaseUser, profileMissing, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading...</div>;
  }
  if (!firebaseUser) return <Navigate to="/login" replace />;

  // Signed into Firebase but with no app profile yet (a Google user who never
  // finished picking a role). Without this, they'd reach a dashboard rendering
  // against a null profile. /complete-profile is exempt or it would loop.
  if (profileMissing && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
