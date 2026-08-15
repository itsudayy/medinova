import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import DoctorCard from '../components/DoctorCard';
import Input from '../components/ui/Input';
import { fetchDoctors } from '../services/doctorService';

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      fetchDoctors(search ? { search } : {})
        .then(setDoctors)
        .finally(() => setLoading(false));
    }, 300); // debounce so we don't hit the API on every keystroke

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Find a Doctor</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Browse verified specialists and book a consultation.</p>
        </div>

        <div className="mb-6 max-w-md">
          <Input
            icon={Search}
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-slate-400 dark:text-slate-500">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400">No doctors found yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} onClick={() => navigate(`/doctors/${doc._id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
