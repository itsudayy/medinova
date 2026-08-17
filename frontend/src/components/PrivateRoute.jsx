import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading...</div>;
  }
  if (!firebaseUser) return <Navigate to="/login" replace />;

  return children;
}
