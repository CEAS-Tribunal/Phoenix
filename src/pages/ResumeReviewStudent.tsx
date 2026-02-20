import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ResumeReviewDay, type EmployerTimeslot, type Timeslot } from '@/services/ResumeReviewService';
import { Clock, Building2, User, Check } from 'lucide-react';

/** Get display time from a timeslot object */
function getSlotTime(slot: Timeslot): string {
  return slot.timeslot ?? slot.time ?? '';
}

/** Selected slot: one per employer, max 2 employers */
type SelectedSlots = Record<string, { timeslotId: string; time: string }>;

const MAJOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'aero', label: 'Aerospace Engineering' },
  { value: 'arch', label: 'Architectural Engineering' },
  { value: 'bmes', label: 'Biomedical Engineering' },
  { value: 'chem', label: 'Chemical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'compe', label: 'Computer Engineering' },
  { value: 'const', label: 'Construction Management' },
  { value: 'cyber', label: 'Cybersecurity Engineering' },
  { value: 'elec', label: 'Electrical Engineering' },
  { value: 'elect', label: 'Electrical Engineering Technology' },
  { value: 'ise', label: 'Industrial & Systems Engineering' },
  { value: 'mech', label: 'Mechanical Engineering' },
  { value: 'mecht', label: 'Mechanical Engineering Technology' },
];

const TIMESLOTS: { time: string }[] = [
    { time: '9:00 AM' },
    { time: '9:20 AM' },
    { time: '9:40 AM' },
    { time: '10:00 AM' },
    { time: '10:20 AM' },
    { time: '10:40 AM' },
    { time: '11:00 AM' },
    { time: '11:20 AM' },
    { time: '11:40 AM' },
    { time: '12:00 PM' },
    { time: '12:20 PM' },
    { time: '12:40 PM' },
    { time: '1:00 PM' },
    { time: '1:20 PM' },
    { time: '1:40 PM' },
    { time: '2:00 PM' },
    { time: '2:20 PM' },
    { time: '2:40 PM' },
    { time: '3:00 PM' }
]

const INTERVIEW_SLOTS: { type: string }[] = [
    { type: 'In-Person' },
];

const MAX_EMPLOYERS = 2;

export default function ResumeReviewStudent() {
    const [selectedInterviewStyle, setSelectedInterviewStyle] = useState<string>('');
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    const [selectedTimeslot, setSelectedTimeslot] = useState<string[]>([]);
    const [results, setResults] = useState<EmployerTimeslot[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** One timeslot per employer, max 2 employers */
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlots>({});

    /** Student signup form */
    const [signupForm, setSignupForm] = useState({
        full_name: '',
        email: '',
        grad_year: new Date().getFullYear(),
        major: '',
        resume: null as File | null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<{ message: string; full_name: string } | null>(null);

    async function handleFilter() {
        setError(null);
        setLoading(true);
        try {
            const data = await ResumeReviewDay.getTimeslots({
                major: selectedMajor || undefined,
                time: selectedTimeslot.length > 0 ? selectedTimeslot : undefined,
            });
            setResults(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load timeslots');
            setResults(null);
        } finally {
            setLoading(false);
        }
    }

    function handleSelectSlot(employerId: string, timeslotId: string, time: string) {
        setSelectedSlots((prev) => {
            const next = { ...prev };
            const existingCount = Object.keys(prev).length;
            const alreadySelected = employerId in prev;
            if (alreadySelected && prev[employerId].timeslotId === timeslotId) {
                delete next[employerId];
                return next;
            }
            if (alreadySelected || existingCount < MAX_EMPLOYERS) {
                next[employerId] = { timeslotId, time };
                return next;
            }
            return prev;
        });
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        const timeslotIds = Object.values(selectedSlots).map((s) => s.timeslotId);
        if (timeslotIds.length === 0 || !signupForm.resume) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await ResumeReviewDay.registerStudent({
                full_name: signupForm.full_name,
                email: signupForm.email,
                grad_year: signupForm.grad_year,
                major: signupForm.major,
                resume: signupForm.resume,
                timeslots: timeslotIds,
            });
            setSubmitSuccess({
                message: res.data.message || 'Registered successfully!',
                full_name: signupForm.full_name,
            });
            setSelectedSlots({});
            setResults(null);
            setSignupForm({ full_name: '', email: '', grad_year: new Date().getFullYear(), major: '', resume: null });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to sign up');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className='flex flex-col items-center justify-center bg-white'>
                <div className='flex flex-col items-center py-12 px-6 w-full'>
                <div className='text-black flex flex-col items-center w-3/5 gap-y-6'>
                    <div className='text-red-600 text-sm uppercase tracking-wide font-medium'>Resume Review Day</div>
                    <h1 className='text-5xl font-bold text-black text-center leading-tight'>Resume Review Day Student Registration</h1>
                    <p className='text-lg text-black/90 text-center leading-relaxed'>Resume Review Day is an event hosted by the College of Engineering and Applied Science 
                        Tribunal in order to help prepare students for the Career Fair. This event gives students 
                        the opportunity to sign up for 20 minute intervals to receive resume feedback from industry 
                        leaders and also gives students the ability to network with employers before the Technical 
                        Career Fair. Resume Review Day takes place on Monday, February 2nd, 2026 in Rhodes 800.
                    </p>
                    <p className='text-base text-black/80 text-center leading-relaxed'>
                        Select a timeslot with an employer by browsing all of the available options or filter by major, 
                        a desired time (if applicable), and a desired review method. You are able to register for up to 
                        2 different employer(s). The last day to sign up will be on Wednesday, January 28th, 2026. Further 
                        instructions will be sent to your email after signing up.
                    </p>
                    <p className='text-base text-black/80 text-center'>If you have any questions, please contact us at <a href='mailto:uccareerfair@gmail.com' className='text-red-600 hover:text-red-700 hover:underline hover:underline-offset-[3px]'>uccareerfair@gmail.com</a>.</p>
                </div>

                {!submitSuccess && (
                <div className='bg-white w-2/5 flex flex-col my-8 rounded-xl p-6 gap-y-4 shadow-lg border border-white/50'>
                    <div className=''>
                        <label className='block text-slate-700 font-medium mb-2'>Major</label>
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white'
                        >
                            <option value=''>Select major</option>
                            {MAJOR_OPTIONS.map((major) => (
                                <option key={major.value} value={major.value}>
                                    {major.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-2">
                            Select up to <span className="font-bold">2</span> Timeslot(s)
                        </label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {selectedTimeslot.length > 0 &&
                                selectedTimeslot.map((ts) => (
                                    <span key={ts} className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2 border border-red-200">
                                        {ts}
                                        <button
                                            type="button"
                                            aria-label="Remove"
                                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                                            onClick={() => setSelectedTimeslot((prev) => prev.filter((t) => t !== ts))}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-white">
                            {TIMESLOTS.map((slot, idx) => {
                                const checked = selectedTimeslot.includes(slot.time);
                                const disabled = !checked && selectedTimeslot.length >= 2;
                                return (
                                    <label
                                        key={slot.time || idx}
                                        className={`flex items-center px-2 py-1 rounded cursor-pointer transition-colors ${checked ? 'bg-red-100 text-red-800' : 'hover:bg-slate-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={slot.time}
                                            checked={checked}
                                            disabled={disabled}
                                            onChange={() => {
                                                if (checked) {
                                                    setSelectedTimeslot((prev) => prev.filter((t) => t !== slot.time));
                                                } else {
                                                    setSelectedTimeslot((prev) => [...prev, slot.time]);
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        {slot.time}
                                    </label>
                                );
                            })}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {selectedTimeslot.length === 2 ? 'Maximum of 2 timeslots selected.' : ''}
                        </div>
                    </div>
                    <div className=''>
                        <label className='block text-slate-700 font-medium mb-2'>Interview Style</label>
                        <select
                            value={selectedInterviewStyle}
                            onChange={(e) => setSelectedInterviewStyle(e.target.value)}
                            className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white'
                        >
                            <option value=''>Select interview style</option>
                            {INTERVIEW_SLOTS.map((slot, index) => (
                                <option key={index} value={slot.type}>
                                    {slot.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={handleFilter}
                        disabled={loading}
                        className='bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-lg w-2/5 py-3 mx-auto transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Loading…' : 'Filter'}
                    </button>
                </div>
                )}

                {error && !submitSuccess && (
                    <p className="text-red-600 font-medium mt-4 w-2/5 text-center">{error}</p>
                )}
                </div>

                {submitSuccess && (
                    <div className="w-2/5 my-6 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                        <p className="text-lg font-semibold text-emerald-900">{submitSuccess.message}</p>
                        <p className="text-emerald-700">Further instructions will be sent to your email.</p>
                        <p className="text-gray-800 font-medium">Would you like to submit another entry?</p>
                        <button
                            type="button"
                            onClick={() => setSubmitSuccess(null)}
                            className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Yes, register again
                        </button>
                    </div>
                )}

                {!submitSuccess && results && results.length > 0 && (
                    <>
                        <div className="w-3/5 my-10 border-t border-slate-200" aria-hidden />
                        <div className="w-full px-6 sm:px-8 md:px-12 my-6 space-y-4">
                        <h2 className="text-2xl font-bold text-black">Available Employers</h2>
                        <p className="text-black/90 text-sm">Select one timeslot per employer (up to {MAX_EMPLOYERS} employers).</p>

                        <div className="flex flex-wrap gap-4">
                            {results.map((employer) => {
                                const selected = selectedSlots[employer.id];
                                const employerCount = Object.keys(selectedSlots).length;
                                const canSelect = employerCount < MAX_EMPLOYERS || employer.id in selectedSlots;

                                return (
                                    <div
                                        key={employer.id}
                                        className="min-w-[280px] flex-[1_1_280px] rounded-xl bg-white/95 shadow-lg overflow-hidden border border-white/50"
                                    >
                                        <div className="px-6 py-4 bg-slate-800/10 border-b border-slate-200/60">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-red-100">
                                                    <Building2 className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">{employer.company_name}</h3>
                                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5" />
                                                        {employer.full_name}
                                                    </p>
                                                </div>
                                                {selected && (
                                                    <span className="ml-auto flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                        <Check className="w-4 h-4" />
                                                        {selected.time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-6 py-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                Available times
                                            </p>
                                            <ul className="flex flex-wrap gap-2">
                                                {employer.timeslots.map((slot) => {
                                                    const time = getSlotTime(slot);
                                                    const isSelected = selected?.timeslotId === slot.id;
                                                    const disabled = !canSelect && !isSelected;

                                                    return (
                                                        <li key={slot.id}>
                                                            <button
                                                                type="button"
                                                                disabled={disabled}
                                                                onClick={() => handleSelectSlot(employer.id, slot.id, time)}
                                                                className={`
                                                                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                                                                    ${isSelected
                                                                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-500/50'
                                                                        : disabled
                                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                            : 'bg-slate-100 text-slate-700 hover:bg-red-100 hover:text-red-800 hover:border-red-300 border border-transparent'
                                                                    }
                                                                `}
                                                            >
                                                                {time}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {Object.keys(selectedSlots).length > 0 && (
                            <form onSubmit={handleSignup} className="mt-8 p-6 rounded-xl bg-white/95 shadow-lg border border-white/50 space-y-4 w-full">
                                <h3 className="text-lg font-semibold text-slate-800">Complete your registration</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                                        <input
                                            type="text"
                                            required
                                            value={signupForm.full_name}
                                            onChange={(e) => setSignupForm((f) => ({ ...f, full_name: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={signupForm.email}
                                            onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Graduation year</label>
                                        <input
                                            type="number"
                                            min={2024}
                                            max={2040}
                                            required
                                            value={signupForm.grad_year}
                                            onChange={(e) => setSignupForm((f) => ({ ...f, grad_year: parseInt(e.target.value, 10) || f.grad_year }))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Major</label>
                                        <select
                                            required
                                            value={signupForm.major}
                                            onChange={(e) => setSignupForm((f) => ({ ...f, major: e.target.value }))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                                        >
                                            <option value="">Select major</option>
                                            {MAJOR_OPTIONS.map((m) => (
                                                <option key={m.value} value={m.value}>{m.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        required
                                        onChange={(e) => setSignupForm((f) => ({ ...f, resume: e.target.files?.[0] ?? null }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-100 file:text-red-800 file:font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting…' : 'Submit registration'}
                                </button>
                            </form>
                        )}
                    </div>
                    </>
                )}

                {!submitSuccess && results && results.length === 0 && (
                    <p className="text-black/80 my-6 w-full px-6 sm:px-8 md:px-12 text-center">No available timeslots match your filters.</p>
                )}
            </div>

            <Footer />
        </>
    )
}