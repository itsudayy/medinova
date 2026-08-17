import { Star, Briefcase, Video, Building2 } from 'lucide-react';
import SmartImage from './ui/SmartImage';

export default function DoctorCard({ doctor, onClick }) {
  const { user, specialization, experienceYears, videoFee, physicalFee, ratingAverage, ratingCount } = doctor;
  const initial = user?.name?.[0]?.toUpperCase() || 'D';

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800
        overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-none
        hover:border-brand-300 dark:hover:border-brand-500/40 hover:-translate-y-1
        transition-all duration-300"
    >
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {user?.photoURL ? (
          <SmartImage
            src={user.photoURL}
            alt={user?.name || 'Doctor'}
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallback={<InitialBlock initial={initial} />}
          />
        ) : (
          <InitialBlock initial={initial} />
        )}

        <span className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
          {ratingCount > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-slate-800 dark:text-slate-100">{ratingAverage.toFixed(1)}</span>
              <span className="text-slate-400 dark:text-slate-500">({ratingCount})</span>
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">New</span>
          )}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-slate-900 dark:text-white truncate">{user?.name}</h3>
        <p className="text-brand-600 dark:text-brand-400 text-sm font-medium">{specialization}</p>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
          <Briefcase className="w-3.5 h-3.5" /> {experienceYears} years experience
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Video className="w-3.5 h-3.5 text-brand-500" />
            <span className="font-semibold">${videoFee}</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-teal-accent" />
            <span className="font-semibold">${physicalFee}</span>
          </span>
        </div>
      </div>
    </button>
  );
}

function InitialBlock({ initial }) {
  return (
    <div className="h-full w-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center">
      <span className="text-white text-4xl font-display font-bold">{initial}</span>
    </div>
  );
}
