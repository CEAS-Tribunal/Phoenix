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
      setServerResponse({ message: res.message.message || 'Registered!', status: res.status });
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
        <div className="bg-gradient-to-b from-red-500/90 via-rose-600/85 to-red-700/90 py-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900/95 dark:border dark:border-slate-700/50 px-8 py-12 rounded-2xl shadow-2xl text-center animate-in fade-in zoom-in duration-500">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 ring-4 ring-emerald-200/60 dark:ring-emerald-800/50">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              You&apos;re all set!
            </h1>
            <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-1">
              {serverResponse?.message}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              We&apos;ve received your employer registration for Resume Review Day. Our team will reach out with further details and next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setServerResponse(null)}
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:text-gray-100 dark:hover:bg-slate-800/80"
              >
                <UserPlus className="h-4 w-4" />
                Register another employer
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to home
                </Link>
              </Button>
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
      <div className="bg-gradient-to-b from-red-500/90 via-rose-600/85 to-red-700/90 py-10 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white dark:bg-muted px-8 py-10 rounded-xl shadow-lg">
          {serverResponse?.error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-800">
              <span className="font-semibold">Error{serverResponse.status ? ` (${serverResponse.status})` : ''}:</span> {serverResponse.error}
            </div>
          )}
          <h1 className="text-2xl font-bold mb-6">Employer Registration</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                {...register("full_name", { required: true })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Full Name"
              />
              {errors.full_name && <p className="text-rose-500 text-sm mt-1">This field is required</p>}
            </div>
            {/* Company Name */}
            <div>
              <label className="block font-medium mb-1">Company Name</label>
              <input
                type="text"
                {...register("company_name", { required: true })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Company Name"
              />
              {errors.company_name && <p className="text-rose-500 text-sm mt-1">This field is required</p>}
            </div>
            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Email"
              />
              {errors.email && <p className="text-rose-500 text-sm mt-1">This field is required</p>}
            </div>
            {/* Phone Number */}
            <div>
              <label className="block font-medium mb-1">Phone Number (xxx-xxx-xxxx)</label>
              <input
                type="tel"
                {...register("phone_number")}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Phone Number"
              />
            </div>
            {/* Dietary Restrictions */}
            <div>
              <label className="block font-medium mb-1">Dietary Restrictions (if applicable)</label>
              <input
                type="text"
                {...register("diet_restriction")}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Dietary Restriction"
              />
            </div>
            {/* Start Time */}
            <div>
              <label className="block font-medium mb-1">Start Time</label>
              <input
                type="time"
                {...register("start_time", { required: true })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
              />
              {errors.start_time && <p className="text-rose-500 text-sm mt-1">This field is required</p>}
            </div>
            {/* End Time */}
            <div>
              <label className="block font-medium mb-1">End Time</label>
              <input
                type="time"
                {...register("end_time", { required: true })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
              />
              {errors.end_time && <p className="text-rose-500 text-sm mt-1">This field is required</p>}
            </div>
            {/* Max Resumes */}
            <div>
              <label className="block font-medium mb-1">Maximum Resumes (max 20)</label>
              <input
                type="number"
                {...register("max_resumes", { required: true, min: 1, max: 20 })}
                className="w-full input input-bordered rounded-lg py-2 px-3 border focus:ring-primary-500"
                placeholder="Max number of resumes"
                min={1}
                max={100}
              />
              {errors.max_resumes && (
                <p className="text-rose-500 text-sm mt-1">
                  Must be between 1 and 100
                </p>
              )}
            </div>
            {/* UC Alumnus */}
            <div className="flex items-center mt-4">
              <Controller
                control={control}
                name="uc_alumni"
                render={({ field }) => (
                  <>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="uc_alumni" />
                    <label htmlFor="uc_alumni" className="ml-3 font-medium">UC Alumnus</label>
                  </>
                )}
              />
            </div>
            {/* Majors */}
            <div className="mt-6">
              <label className="font-semibold mb-2 block">Select your major(s) of interest:</label>
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
                    <label htmlFor={major.value} className="ml-3">{major.label}</label>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit */}
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-700 mt-6" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
