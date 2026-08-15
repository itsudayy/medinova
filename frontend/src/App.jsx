import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import DoctorDetail from './pages/DoctorDetail';
import DoctorProfileForm from './pages/DoctorProfileForm';
import BookingConfirm from './pages/BookingConfirm';
import MyAppointments from './pages/MyAppointments';
import Premium from './pages/Premium';
import PremiumConfirm from './pages/PremiumConfirm';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute>
              <CompleteProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <PrivateRoute>
              <DoctorList />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <PrivateRoute>
              <DoctorDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <PrivateRoute>
              <DoctorProfileForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/confirm"
          element={
            <PrivateRoute>
              <BookingConfirm />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <MyAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <PrivateRoute>
              <Premium />
            </PrivateRoute>
          }
        />
        <Route
          path="/premium/confirm"
          element={
            <PrivateRoute>
              <PremiumConfirm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
