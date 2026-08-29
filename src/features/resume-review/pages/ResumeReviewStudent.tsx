import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatErrorMessage } from '@shared/lib/formatError';
import Navbar from '@shared/components/layout/Navbar';
import Footer from '@shared/components/layout/Footer';
import { ResumeReviewDay, type StudentData, type Timeslot } from '../services/resumeReviewService';
import { rrdKeys } from '../queryKeys';
import ResumeReviewClosedPage from './ResumeReviewClosedPage';
import { Clock, Building2, User, Check } from 'lucide-react';

/** Get display time from a timeslot object */
function getSlotTime(slot: Timeslot): string {
  return slot.timeslot ?? slot.time ?? '';
}

/** Parse "9:00 AM" / "12:20 PM" style string to minutes since midnight for sorting */
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const pm = match[3].toUpperCase() === 'PM';
  if (hours === 12) hours = pm ? 12 : 0;
  else if (pm) hours += 12;
  return hours * 60 + minutes;
}

/** Sort timeslots chronologically by their display time */
function sortTimeslots<T extends Timeslot>(slots: T[]): T[] {
  return [...slots].sort((a, b) => {
    const timeA = getSlotTime(a);
    const timeB = getSlotTime(b);
    return parseTimeToMinutes(timeA) - parseTimeToMinutes(timeB);
  });
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

/** Hourly ranges for the filter step; each expands to 20-minute slots the API understands */
const TIME_RANGES: { id: string; label: string; times: string[] }[] = [
    { id: '9-10', label: '9:00 AM – 10:00 AM', times: ['9:00 AM', '9:20 AM', '9:40 AM'] },
    { id: '10-11', label: '10:00 AM – 11:00 AM', times: ['10:00 AM', '10:20 AM', '10:40 AM'] },
    { id: '11-12', label: '11:00 AM – 12:00 PM', times: ['11:00 AM', '11:20 AM', '11:40 AM'] },
    { id: '12-1', label: '12:00 PM – 1:00 PM', times: ['12:00 PM', '12:20 PM', '12:40 PM'] },
    { id: '1-2', label: '1:00 PM – 2:00 PM', times: ['1:00 PM', '1:20 PM', '1:40 PM'] },
    { id: '2-3', label: '2:00 PM – 3:00 PM', times: ['2:00 PM', '2:20 PM', '2:40 PM'] },
];

function timesFromSelectedRanges(rangeIds: string[]): string[] {
    const expanded = rangeIds.flatMap((id) => TIME_RANGES.find((r) => r.id === id)?.times ?? []);
    return [...new Set(expanded)];
}

const INTERVIEW_SLOTS: { type: string }[] = [
    { type: 'In-Person' },
];

const MAX_EMPLOYERS = 2;

export default function ResumeReviewStudent() {
    const queryClient = useQueryClient();
    const settingsQuery = useQuery({
        queryKey: rrdKeys.settings,
        queryFn: () => ResumeReviewDay.getSettings(),
    });

    const [selectedInterviewStyle, setSelectedInterviewStyle] = useState<string>('');
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    /** Selected hour-range ids for the initial filter (any number of ranges) */
    const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);

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
    const [submitSuccess, setSubmitSuccess] = useState<{ message: string; full_name: string } | null>(null);

    const filterParams = useMemo(() => {
        const expandedTimes = timesFromSelectedRanges(selectedTimeRanges);
        return {
            major: selectedMajor || undefined,
            time: expandedTimes.length > 0 ? expandedTimes : undefined,
        };
    }, [selectedMajor, selectedTimeRanges]);

    const timeslotsQuery = useQuery({
        queryKey: rrdKeys.timeslots(filterParams),
        queryFn: () => ResumeReviewDay.getTimeslots(filterParams),
        enabled: false,
    });

    const signupMutation = useMutation({
        mutationFn: (payload: StudentData) => ResumeReviewDay.registerStudent(payload),
        onSuccess: (res, variables) => {
            setSubmitSuccess({
                message: res.data.message || 'Registered successfully!',
                full_name: variables.full_name,
            });
            setSelectedSlots({});
            setSignupForm({ full_name: '', email: '', grad_year: new Date().getFullYear(), major: '', resume: null });
            void queryClient.invalidateQueries({ queryKey: rrdKeys.all });
        },
    });

    if (settingsQuery.data && !settingsQuery.data.student_page_open) {
        return <ResumeReviewClosedPage audience="student" />;
    }

    const results = timeslotsQuery.isFetched ? (timeslotsQuery.data ?? null) : null;
    const loading = timeslotsQuery.isFetching;
    const filterError =
        timeslotsQuery.error != null
            ? formatErrorMessage(timeslotsQuery.error)
            : timeslotsQuery.isError
              ? 'Failed to load timeslots'
              : null;
    const signupError =
        signupMutation.error != null
            ? formatErrorMessage(signupMutation.error)
            : signupMutation.isError
              ? 'Failed to sign up'
              : null;

    function handleFilter() {
        void timeslotsQuery.refetch();
    }

    function handleSelectSlot(employerId: string, timeslotId: string, time: string) {
        setSelectedSlots((prev) => {
            const next = { ...prev };
            const existingCount = Object.keys(prev).length;
            const alreadySelected = employerId in prev;
            
            // Check if this time is already selected for another employer
            const timeAlreadySelected = Object.values(prev).some(
                (slot) => slot.time === time && slot.timeslotId !== timeslotId
            );
            
            if (alreadySelected && prev[employerId].timeslotId === timeslotId) {
                delete next[employerId];
                return next;
            }
            
            // Prevent selection if time is already taken by another employer
            if (timeAlreadySelected) {
                return prev;
            }
            
            if (alreadySelected || existingCount < MAX_EMPLOYERS) {
                next[employerId] = { timeslotId, time };
                return next;
            }
            return prev;
        });
    }

    function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        const timeslotIds = Object.values(selectedSlots).map((s) => s.timeslotId);
        if (timeslotIds.length === 0 || !signupForm.resume) return;
        signupMutation.mutate({
            full_name: signupForm.full_name,
            email: signupForm.email,
            grad_year: signupForm.grad_year,
            major: signupForm.major,
            resume: signupForm.resume,
            timeslots: timeslotIds,
        });
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
                        Career Fair. Resume Review Day takes place on Tuesday, September 8th, 2026 in TUC 400ABC.
                    </p>
                    <p className='text-base text-black/80 text-center leading-relaxed'>
                        Filter by major, optional time ranges, and review method, then choose specific 20-minute times with
                        up to two employers (one slot per employer). The last day to sign up will be on Wednesday,
                        September 2nd, 2026. Further instructions will be sent to your email after signing up.
                    </p>
                    <p className='text-base text-black/80 text-center'>If you have any questions, please contact us at <a href='mailto:uccareerfair@gmail.com' className='text-red-600 hover:text-red-700 hover:underline hover:underline-offset-[3px]'>uccareerfair@gmail.com</a>.</p>
                </div>

                {!submitSuccess && (
                <div className='bg-white w-2/5 flex flex-col my-8 rounded-xl p-6 gap-y-4 shadow-lg border border-white/50'>
                    {filterError && (
                        <p className="text-red-600 font-medium text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {filterError}
                        </p>
                    )}
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
                            Time availability <span className="text-slate-500 font-normal">(optional)</span>
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Choose hour ranges you are available. Leave none selected to see all times. After you filter,
                            you will pick exact 20-minute slots with each employer.
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                            {selectedTimeRanges.length > 0 &&
                                selectedTimeRanges.map((rid) => {
                                    const r = TIME_RANGES.find((x) => x.id === rid);
                                    if (!r) return null;
                                    return (
                                    <span key={rid} className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2 border border-red-200">
                                        {r.label}
                                        <button
                                            type="button"
                                            aria-label="Remove"
                                            className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                                            onClick={() => setSelectedTimeRanges((prev) => prev.filter((id) => id !== rid))}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                    );
                                })}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 border border-slate-200 rounded-lg p-2 bg-white">
                            {TIME_RANGES.map((range) => {
                                const checked = selectedTimeRanges.includes(range.id);
                                return (
                                    <label
                                        key={range.id}
                                        className={`flex items-center px-2 py-2 rounded cursor-pointer transition-colors ${checked ? 'bg-red-100 text-red-800' : 'hover:bg-slate-50'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={range.id}
                                            checked={checked}
                                            onChange={() => {
                                                if (checked) {
                                                    setSelectedTimeRanges((prev) => prev.filter((id) => id !== range.id));
                                                } else {
                                                    setSelectedTimeRanges((prev) => [...prev, range.id]);
                                                }
                                            }}
                                            className="mr-2 shrink-0"
                                        />
                                        {range.label}
                                    </label>
                                );
                            })}
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
                        <p className="text-black/90 text-sm">
                            Choose specific 20-minute times below: one slot per employer, at most {MAX_EMPLOYERS} employers
                            total, and at least one slot to register. You cannot pick the same clock time with two
                            different employers.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {results.map((employer) => {
                                const selected = selectedSlots[employer.id];
                                const employerCount = Object.keys(selectedSlots).length;
                                const canSelect = employerCount < MAX_EMPLOYERS || employer.id in selectedSlots;

                                return (
                                    <div
                                        key={employer.id}
                                        className="min-w-70 flex-[1_1_280px] rounded-xl bg-white/95 shadow-lg overflow-hidden border border-white/50"
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
                                                {sortTimeslots(employer.timeslots).map((slot) => {
                                                    const time = getSlotTime(slot);
                                                    const isSelected = selected?.timeslotId === slot.id;
                                                    // Check if this time is already selected for another employer
                                                    const timeAlreadySelected = Object.values(selectedSlots).some(
                                                        (s) => s.time === time && s.timeslotId !== slot.id
                                                    );
                                                    const disabled = (!canSelect && !isSelected) || (timeAlreadySelected && !isSelected);

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

                        {signupError && (
                            <p className="mt-8 text-red-600 font-medium text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {signupError}
                            </p>
                        )}

                        <form onSubmit={handleSignup} className="mt-4 p-6 rounded-xl bg-white/95 shadow-lg border border-white/50 space-y-4 w-full">
                                <h3 className="text-lg font-semibold text-slate-800">Complete your registration</h3>
                                {Object.keys(selectedSlots).length === 0 && (
                                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                        Select at least one time with an employer above before submitting.
                                    </p>
                                )}
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
                                    disabled={signupMutation.isPending || Object.keys(selectedSlots).length === 0}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {signupMutation.isPending ? 'Submitting…' : 'Submit registration'}
                                </button>
                            </form>
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