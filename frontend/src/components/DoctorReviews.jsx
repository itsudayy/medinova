import { useEffect, useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import StarRating from './ui/StarRating';
import { fetchDoctorReviews } from '../services/doctorService';

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function DoctorReviews({ doctorId, ratingAverage, ratingCount }) {
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorReviews(doctorId)
      .then(({ reviews, distribution }) => {
        setReviews(reviews);
        setDistribution(distribution);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) {
    return <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">Loading reviews...</div>;
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
      <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-1.5">
        <MessageSquareQuote className="w-4 h-4" /> Patient Reviews
      </h2>

      {ratingCount === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <StarRating value={0} className="justify-center" />
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">No reviews yet — be the first after your consultation.</p>
        </div>
      ) : (
        <>
          {/* Summary: the average on the left, the shape of the ratings on the right. */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="text-center shrink-0">
              <p className="font-display text-5xl font-bold text-slate-900 dark:text-white leading-none">
                {ratingAverage.toFixed(1)}
              </p>
              <StarRating value={Math.round(ratingAverage)} className="mt-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                {ratingCount} review{ratingCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution?.[star] || 0;
                const pct = ratingCount ? (count / ratingCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 w-3 tabular-nums">{star}</span>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 w-4 text-right tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-teal-accent flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {r.patient?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{r.patient?.name || 'Patient'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(r.reviewedAt)} · {r.type} consultation
                    </p>
                  </div>
                  <StarRating value={r.rating} size="sm" />
                </div>
                {r.review && <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">{r.review}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
