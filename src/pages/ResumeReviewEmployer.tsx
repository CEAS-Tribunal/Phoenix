import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ResumeReviewDay } from '@/services/ResumeReviewService';

const MAJOR_OPTIONS = [
  "Aerospace Engineering",
  "Architectural Engineering",
  "Biomedical Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Computer Science",
  "Construction Management",
  // Add more majors as needed
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
  const [serverResponse, setServerResponse] = useState<null | { message?: string; error?: string }>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setServerResponse(null);

    // Prepare payload for backend
    const payload = {
      ...data,
    };

    try {
      const res = await ResumeReviewDay.registerEmployer(payload);
      setServerResponse({ message: res.message || 'Registered!' });
      reset();
    } catch (e: any) {
      setServerResponse({ error: e.response?.data?.error || e.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-red-500/80 pt-10 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white dark:bg-muted px-8 py-10 rounded-xl shadow-lg">
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
              <label className="block font-medium mb-1">Phone Number (+x xxx-xxx-xxxx)</label>
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
                  <div key={major} className="flex items-center">
                    <Controller
                      control={control}
                      name="selected_majors"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value.includes(major)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) field.onChange([...field.value, major]);
                            else field.onChange(field.value.filter((v: string) => v !== major));
                          }}
                          id={major}
                        />
                      )}
                    />
                    <label htmlFor={major} className="ml-3">{major}</label>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit */}
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-700 mt-6" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
          {/* User Feedback */}
          {serverResponse?.message && (
            <div className="mt-4 text-green-600">{serverResponse.message}</div>
          )}
          {serverResponse?.error && (
            <div className="mt-4 text-rose-600">Error: {serverResponse.error}</div>
          )}
        </div>
      </div>
    </>
  );
}
