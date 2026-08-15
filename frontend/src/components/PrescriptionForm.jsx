import { useState } from 'react';
import { Pill, Send } from 'lucide-react';
import Button from './ui/Button';
import { setPrescription } from '../services/appointmentService';

// Doctor-only. Collapsed to a button until clicked, same reasoning as
// ReviewForm: an always-open textarea on every card would drown the list.
// Unlike ReviewForm, this pre-fills from any existing prescription and stays
// reachable afterward — prescriptions are meant to be editable.
export default function PrescriptionForm({ appointment, onSaved }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(appointment.prescription || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!text.trim()) return setError('Prescription text cannot be empty.');
    setSaving(true);
    try {
      const updated = await setPrescription(appointment._id, text);
      onSaved(updated);
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
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
        <Pill className="w-4 h-4" /> {appointment.prescription ? 'Edit prescription' : 'Write prescription'}
      </button>
    );
  }

  return (
    <div className="mt-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="e.g. Amoxicillin 500mg — 1 tablet 3x daily for 7 days. Rest and stay hydrated."
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
          text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
      />

      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-2">{error}</p>}

      <div className="flex items-center gap-2 mt-3">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : <><Send className="w-4 h-4" /> Save prescription</>}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Read-only display, shown to the patient (and to the doctor once collapsed).
export function PrescriptionView({ appointment }) {
  if (!appointment.prescription) return null;
  return (
    <div className="mt-3 bg-brand-50/60 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-xl px-4 py-3">
      <p className="text-xs font-medium text-brand-700 dark:text-brand-400 flex items-center gap-1 mb-1.5">
        <Pill className="w-3.5 h-3.5" /> Prescription
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{appointment.prescription}</p>
    </div>
  );
}
