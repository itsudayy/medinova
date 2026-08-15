import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Plus, Trash2, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { fetchMyDoctorProfile, saveMyDoctorProfile } from '../services/doctorService';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const emptySlot = () => ({ day: 'Mon', startTime: '09:00', endTime: '17:00' });

export default function DoctorProfileForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    specialization: '',
    bio: '',
    experienceYears: 0,
    videoFee: 0,
    physicalFee: 0,
    availability: [emptySlot()],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchMyDoctorProfile()
      .then((data) => {
        setForm({
          specialization: data.specialization || '',
          bio: data.bio || '',
          experienceYears: data.experienceYears || 0,
          videoFee: data.videoFee || 0,
          physicalFee: data.physicalFee || 0,
          availability: data.availability?.length ? data.availability : [emptySlot()],
        });
      })
      .catch(() => {}) // 404 = no profile yet, fine — start blank
      .finally(() => setLoading(false));
  }, []);

  function updateSlot(index, field, value) {
    const next = [...form.availability];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, availability: next });
  }

  function addSlot() {
    setForm({ ...form, availability: [...form.availability, emptySlot()] });
  }

  function removeSlot(index) {
    setForm({ ...form, availability: form.availability.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      await saveMyDoctorProfile({
        ...form,
        experienceYears: Number(form.experienceYears),
        videoFee: Number(form.videoFee),
        physicalFee: Number(form.physicalFee),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <p className="text-center text-slate-400 dark:text-slate-500 py-20">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Doctor Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">This is what patients will see when browsing.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 px-3 py-2 rounded-lg">
              Profile saved successfully.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Specialization</label>
            <Input
              placeholder="e.g. Cardiologist"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              placeholder="A short introduction for patients..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm px-3.5 py-2.5
                placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Years of experience</label>
              <Input
                type="number"
                min={0}
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Video fee ($)</label>
              <Input
                type="number"
                min={0}
                value={form.videoFee}
                onChange={(e) => setForm({ ...form, videoFee: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Physical fee ($)</label>
              <Input
                type="number"
                min={0}
                value={form.physicalFee}
                onChange={(e) => setForm({ ...form, physicalFee: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weekly availability</label>
            <div className="space-y-2">
              {form.availability.map((slot, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={slot.day}
                    onChange={(e) => updateSlot(i, 'day', e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(i, 'startTime', e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                  <span className="text-slate-400 dark:text-slate-500 text-sm">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(i, 'endTime', e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSlot}
              className="mt-2 flex items-center gap-1.5 text-sm text-brand-700 dark:text-brand-400 font-medium hover:underline"
            >
              <Plus className="w-4 h-4" /> Add time slot
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
