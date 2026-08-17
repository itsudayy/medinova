import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, UserX } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import Input from '../components/ui/Input';
import { fetchDoctors } from '../services/doctorService';

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      fetchDoctors(params)
        .then(setDoctors)
        .catch(() => setDoctors([]))
        .finally(() => setLoading(false));
    }, 300); // debounce so we don't hit the API on every keystroke

    return () => clearTimeout(timeout);
  }, [search, specialization]);

  // Built from whatever specialities actually exist, so the filter never offers
  // an option that would return nothing. Only recomputed on an unfiltered load
  // so the list doesn't shrink to just the current selection.
  const [allSpecialities, setAllSpecialities] = useState([]);
  useEffect(() => {
    fetchDoctors()
      .then((all) => setAllSpecialities([...new Set(all.map((d) => d.specialization))].sort()))
      .catch(() => setAllSpecialities([]));
  }, []);

  const hasFilters = Boolean(search || specialization);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Find a Doctor</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse verified specialists and book a consultation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 max-w-md">
            <Input
              icon={Search}
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full sm:w-56 pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm appearance-none
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
            >
              <option value="">All specializations</option>
              {allSpecialities.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSpecialization(''); }}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 self-start sm:self-center transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {!loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} found
          </p>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <UserX className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="font-display font-semibold text-slate-900 dark:text-white">No doctors found</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {hasFilters ? 'Try a different search or clear your filters.' : 'No doctors are available right now.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} onClick={() => navigate(`/doctors/${doc._id}`)} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CardSkeleton() {
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
