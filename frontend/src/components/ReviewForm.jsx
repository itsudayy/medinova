import { useState } from 'react';
import { Star, Send, Check } from 'lucide-react';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import { submitReview } from '../services/appointmentService';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Collapsed to a single button until the patient actually wants to write —
// an always-open form on every card would drown the appointment list.
export default function ReviewForm({ appointment, onReviewed }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!rating) return setError('Please pick a rating first.');
    setSaving(true);
    try {
      const updated = await submitReview(appointment._id, { rating, review: text });
      onReviewed(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 dark:text-brand-400
          hover:text-brand-800 dark:hover:text-brand-300 hover:gap-2 transition-all"
      >
        <Star className="w-4 h-4" /> Rate this consultation
      </button>
    );
  }

  return (
    <div className="mt-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-[fadeIn_150ms_ease-out]">
      <div className="flex items-center gap-3 flex-wrap">
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{LABELS[rating]}</span>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="How was your consultation? (optional)"
        className="mt-3 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
          text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
      />

      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>}

      <div className="flex items-center gap-2 mt-3">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit review</>}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Shown in place of the form once a review exists.
export function SubmittedReview({ appointment }) {
  return (
    <div className="mt-3 bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <StarRating value={appointment.rating} size="sm" />
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
          <Check className="w-3 h-3" /> Your review
        </span>
      </div>
      {appointment.review && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{appointment.review}</p>
      )}
    </div>
  );
}
