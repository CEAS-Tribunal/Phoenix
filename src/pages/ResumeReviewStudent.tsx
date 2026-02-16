import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ResumeReviewDay, type EmployerTimeslot } from '@/services/ResumeReviewService';

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

export default function ResumeReviewStudent() {
    const [selectedInterviewStyle, setSelectedInterviewStyle] = useState<string>('');
    const [selectedMajor, setSelectedMajor] = useState<string>('');
    const [selectedTimeslot, setSelectedTimeslot] = useState<string[]>([]);
    const [results, setResults] = useState<EmployerTimeslot[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <>
            <Navbar />

            <div className='bg-linear-to-b from-red-500/90 via-rose-600/85 to-red-700/90 flex flex-col items-center py-10'>
                <div className='text-white flex flex-col items-center w-3/5 gap-y-4'>
                    <h1 className='text-5xl border-b-4 pb-2 text-center w-full'>Resume Review Day Student Registration</h1>
                    <p>Resume Review Day is an event hosted by the College of Engineering and Applied Science 
                        Tribunal in order to help prepare students for the Career Fair. This event gives students 
                        the opportunity to sign up for 20 minute intervals to receive resume feedback from industry 
                        leaders and also gives students the ability to network with employers before the Technical 
                        Career Fair. Resume Review Day takes place on Monday, February 2nd, 2026 in Rhodes 800.
                    </p>
                    <p>
                        Select a timeslot with an employer by browsing all of the available options or filter by major, 
                        a desired time (if applicable), and a desired review method. You are able to register for up to 
                        2 different employer(s). The last day to sign up will be on Wednesday, January 28th, 2026. Further 
                        instructions will be sent to your email after signing up.
                    </p>
                    <p>If you have any questions, please contact us at <a href='mailto:uccareerfair@gmail.com' className='text-amber-200 hover:text-amber-100 hover:underline hover:underline-offset-[3px]'>uccareerfair@gmail.com</a>.</p>
                </div>

                <div className='bg-orange-100 w-2/5 flex flex-col my-6 rounded-lg p-6 gap-y-4'>
                    <div className=''>
                        <label className='block text-gray-700 font-medium mb-2'>Major</label>
                        <select
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white'
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
                        <label className="block text-gray-700 font-medium mb-2">
                            Select up to <span className="font-bold">2</span> Timeslot(s)
                        </label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {selectedTimeslot.length > 0 &&
                                selectedTimeslot.map((ts) => (
                                    <span key={ts} className="flex items-center bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm mr-2">
                                        {ts}
                                        <button
                                            type="button"
                                            aria-label="Remove"
                                            className="ml-2 text-red-700 hover:text-red-900 focus:outline-none"
                                            onClick={() => setSelectedTimeslot((prev) => prev.filter((t) => t !== ts))}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
                            {TIMESLOTS.map((slot, idx) => {
                                const checked = selectedTimeslot.includes(slot.time);
                                const disabled = !checked && selectedTimeslot.length >= 2;
                                return (
                                    <label
                                        key={slot.time || idx}
                                        className={`flex items-center px-2 py-1 rounded cursor-pointer ${checked ? 'bg-red-100' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        <div className="text-xs text-gray-500 mt-1">
                            {selectedTimeslot.length === 2 ? 'Maximum of 2 timeslots selected.' : ''}
                        </div>
                    </div>
                    <div className=''>
                        <label className='block text-gray-700 font-medium mb-2'>Interview Style</label>
                        <select
                            value={selectedInterviewStyle}
                            onChange={(e) => setSelectedInterviewStyle(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white'
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
                        className='bg-slate-700 text-2xl rounded-full w-2/5 text-white py-2 mx-auto hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Loading…' : 'Filter'}
                    </button>
                </div>

                {error && (
                    <p className="text-red-600 font-medium mt-4 w-2/5 text-center">{error}</p>
                )}

                {results && (
                    <div className='w-2/5'>
                        {results.map((result) => (
                            <div key={result.id}>
                                {result.full_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}