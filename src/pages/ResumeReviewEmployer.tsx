import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, UserPlus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ResumeReviewDay } from '@/services/ResumeReviewService';

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

type FormValues = {
  full_name: string;
  company_name: string;
  email: string;
  phone_number: string;
  diet_restriction: string;
  start_time: string;
  end_time: string;
  max_resumes: number;
  uc_alumni: boolean;
  selected_majors: string[];
};

export default function ResumeReviewEmployer() {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      uc_alumni: false,
      selected_majors: [],
      max_resumes: 10,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState<null | { message?: string; error?: string; status?: number }>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setServerResponse(null);

    const payload = { ...data };

    try {
      const res = await ResumeReviewDay.registerEmployer(payload);
      setServerResponse({ message: res.data.message || 'Registered!', status: res.status });
      reset();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string }; status?: number }; message?: string };
      setServerResponse({ error: err.response?.data?.error || err.message || 'Submission failed', status: err.response?.status });
      // Do not reset – keep form data filled so user can correct and resubmit
    } finally {
      setSubmitting(false);
    }
  };

  const isSuccess = serverResponse && (serverResponse.status === 201);

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center bg-white">
          <div className="flex flex-col items-center py-12 px-6 w-full">
            <div className="w-2/5 my-6 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-200/70">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-emerald-900 mb-2">
                You&apos;re all set!
              </h1>
              <p className="text-emerald-800 font-medium mb-1">
                {serverResponse?.message}
              </p>
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                We&apos;ve received your employer registration for Resume Review Day. Our team will reach out with further details and next steps.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setServerResponse(null)}
                  className="bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900"
                >
                  <UserPlus className="h-4 w-4" />
                  Register another employer
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Back to home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center py-12 px-6 w-full">
          <div className="text-black flex flex-col items-center w-3/5 gap-y-6">
            <div className="text-sky-600 text-sm uppercase tracking-wide font-medium">Resume Review Day</div>
            <h1 className="text-5xl font-bold text-black text-center leading-tight">
              Resume Review Day Employer Registration
            </h1>
            <p className="text-lg text-black/90 text-center leading-relaxed">
              Partner with the College of Engineering and Applied Science Tribunal to provide 20-minute resume
              review sessions for students preparing for the Technical Career Fair. Share your insights, connect
              with emerging talent, and help students put their best foot forward.
            </p>
            <p className="text-base text-black/80 text-center leading-relaxed">
              Select the time window you will be available, the maximum number of resumes you would like to review,
              and the majors you are most interested in meeting with. Once submitted, our team will confirm your
              schedule and send you additional details.
            </p>
            <p className="text-base text-black/80 text-center">
              If you have any questions, please contact us at{' '}
              <a
                href="mailto:uccareerfair@gmail.com"
                className="text-sky-600 hover:text-sky-700 hover:underline hover:underline-offset-[3px]"
              >
                uccareerfair@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="bg-white w-full max-w-2xl md:w-2/5 flex flex-col my-8 rounded-xl p-6 gap-y-4 shadow-lg border border-white/50">
            {serverResponse?.error && (
              <div className="mb-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <span className="font-semibold">Error{serverResponse.status ? ` (${serverResponse.status})` : ''}:</span>{' '}
                {serverResponse.error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    {...register("full_name", { required: true })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    placeholder="Full name"
                  />
                  {errors.full_name && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    {...register("company_name", { required: true })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    placeholder="Company name"
                  />
                  {errors.company_name && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    placeholder="name@company.com"
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (xxx-xxx-xxxx)</label>
                  <input
                    type="tel"
                    {...register("phone_number")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    placeholder="555-555-5555"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dietary Restrictions <span className="font-normal text-slate-500">(if applicable)</span>
                </label>
                <input
                  type="text"
                  {...register("diet_restriction")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g. vegetarian, gluten-free, none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    {...register("start_time", { required: true })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  {errors.start_time && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    {...register("end_time", { required: true })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  {errors.end_time && <p className="text-rose-500 text-xs mt-1">This field is required</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Resumes (max 20)</label>
                <input
                  type="number"
                  {...register("max_resumes", { required: true, min: 1, max: 20 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="Number of students you can see"
                  min={1}
                  max={100}
                />
                {errors.max_resumes && (
                  <p className="text-rose-500 text-xs mt-1">
                    Must be between 1 and 100
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="uc_alumni"
                    render={({ field }) => (
                      <>
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="uc_alumni" />
                        <label htmlFor="uc_alumni" className="ml-3 text-sm font-medium text-slate-800">
                          UC Alumni
                        </label>
                      </>
                    )}
                  />
                </div>
                <p className="hidden sm:block text-xs text-slate-500">
                  Let us know if you&apos;re a UC graduate.
                </p>
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold mb-2 block text-slate-800">
                  Majors you&apos;re most interested in:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {MAJOR_OPTIONS.map((major) => (
                    <div key={major.value} className="flex items-center">
                      <Controller
                        control={control}
                        name="selected_majors"
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value.includes(major.value)}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) field.onChange([...field.value, major.value]);
                              else field.onChange(field.value.filter((v: string) => v !== major.value));
                            }}
                            id={major.value}
                          />
                        )}
                      />
                      <label htmlFor={major.value} className="ml-3 text-sm text-slate-700">{major.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit registration'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
