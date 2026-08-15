import { Star, Briefcase, DollarSign } from 'lucide-react';

export default function DoctorCard({ doctor, onClick }) {
  const { user, specialization, experienceYears, videoFee, physicalFee, ratingAverage, ratingCount } = doctor;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800
        p-5 hover:shadow-md dark:hover:shadow-none hover:border-brand-200 dark:hover:border-brand-500/40 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white font-semibold shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'D'}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white truncate">{user?.name}</h3>
          <p className="text-brand-600 dark:text-brand-400 text-sm font-medium">{specialization}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" /> {experienceYears} yrs
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" /> {videoFee}/{physicalFee}
        </span>
        {ratingCount > 0 ? (
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{ratingAverage.toFixed(1)}</span>
            <span className="text-slate-400 dark:text-slate-500">({ratingCount})</span>
          </span>
        ) : (
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">New</span>
        )}
      </div>
    </button>
  );
}
