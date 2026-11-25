import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Gavel, UserPlus } from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Checkbox } from "@shared/ui/checkbox";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Switch } from "@shared/ui/switch";
import { formatErrorMessage } from "@shared/lib/formatError";
import { registerJudge, type JudgeRegistrationPayload } from "../services/ExpoRegistrationService";

const CATEGORY_OPTIONS = [
  { value: "7", label: "Technical Excellence" },
  { value: "2", label: "Innovation, Creativity, and Entrepreneurship" },
  { value: "4", label: "Real-World Systems, Solutions, or Process Design" },
  { value: "6", label: "Sustainability and Environmental Responsibility" },
  { value: "1", label: "Human-Centered Research and Design" },
  { value: "3", label: "Interdisciplinary Collaboration" },
  { value: "5", label: "Student Organization Project" },
];

const TIMESLOT_OPTIONS = [
  { value: "1", label: "9:30 – 9:45 AM" },
  { value: "2", label: "9:50 – 10:05 AM" },
  { value: "3", label: "10:10 – 10:25 AM" },
  { value: "4", label: "10:30 – 10:45 AM" },
  { value: "5", label: "10:50 – 11:05 AM" },
  { value: "6", label: "11:10 – 11:25 AM" },
  { value: "7", label: "11:30 – 11:45 AM" },
  { value: "8", label: "11:50 AM – 12:05 PM" },
  { value: "9", label: "12:10 – 12:25 PM" },
  { value: "10", label: "12:30 – 12:45 PM" },
];

const LUNCH_OPTIONS = [
  { value: "1", label: "Chicken" },
  { value: "2", label: "Beef" },
  { value: "3", label: "Fish" },
  { value: "4", label: "Vegetarian" },
  { value: "5", label: "Vegan" },
];

const PROJECT_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1));

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  employer_name: string;
  category_first: string;
  category_second: string;
  category_third: string;
  judging_timeslot: string[];
  number_of_projects: string;
  is_backup_judge: boolean;
  is_attending_lunch: boolean;
  lunch_preference: string;
  dietary_restrictions: string;
};

const DEFAULT_VALUES: FormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  employer_name: "",
  category_first: "",
  category_second: "",
  category_third: "",
  judging_timeslot: [],
  number_of_projects: "",
  is_backup_judge: false,
  is_attending_lunch: false,
  lunch_preference: "",
  dietary_restrictions: "",
};

const FIELD_NAMES = Object.keys(DEFAULT_VALUES) as FieldPath<FormValues>[];

const CATEGORY_RANK_FIELDS = [
  { name: "category_first" as const, label: "1st preference", rank: "1st" },
  { name: "category_second" as const, label: "2nd preference", rank: "2nd" },
  { name: "category_third" as const, label: "3rd preference", rank: "3rd" },
];

function toPayload(values: FormValues): JudgeRegistrationPayload {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    email: values.email.trim(),
    phone_number: values.phone_number.trim(),
    employer_name: values.employer_name.trim(),
    // Rank order: [1st, 2nd, 3rd]
    judging_category: [values.category_first, values.category_second, values.category_third],
    judging_timeslot: values.judging_timeslot,
    number_of_projects: Number(values.number_of_projects),
    is_backup_judge: values.is_backup_judge,
    is_attending_lunch: values.is_attending_lunch,
    lunch_preference: values.is_attending_lunch ? values.lunch_preference : null,
    dietary_restrictions: values.dietary_restrictions.trim(),
  };
}

function toggleValue(list: string[], value: string, checked: boolean): string[] {
  return checked ? [...list, value] : list.filter((v) => v !== value);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4 border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
      <div>
        <legend className="text-xs font-semibold uppercase tracking-wide text-[#E00122]">
          {title}
        </legend>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

export default function JudgeRegistrationPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });
  const [serverError, setServerError] = useState<string | null>(null);

  const isAttendingLunch = watch("is_attending_lunch");
  const categoryFirst = watch("category_first");
  const categorySecond = watch("category_second");
  const categoryThird = watch("category_third");
  const selectedCategories = [categoryFirst, categorySecond, categoryThird];

  const registerMutation = useMutation({
    mutationFn: (values: FormValues) => registerJudge(toPayload(values)),
    onSuccess: () => {
      setServerError(null);
      reset(DEFAULT_VALUES);
      window.scrollTo({ top: 0 });
    },
    onError: (err) => {
      const data = axios.isAxiosError(err) ? err.response?.data : undefined;
      let matchedField = false;
      if (data && typeof data === "object") {
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
          const message = Array.isArray(value) && value.length ? String(value[0]) : null;
          if (!message) continue;
          if (key === "judging_category") {
            setError("category_first", { type: "server", message });
            matchedField = true;
            continue;
          }
          const field = FIELD_NAMES.find((name) => name === key);
          if (field) {
            setError(field, { type: "server", message });
            matchedField = true;
          }
        }
      }
      setServerError(
        matchedField ? "Please fix the highlighted fields and try again." : formatErrorMessage(err)
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-[#F9FAFB]">
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/expo"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#E00122] hover:underline mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to CEAS EXPO
              </Link>

              {registerMutation.isSuccess ? (
                <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
                  <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-200/70">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-bold text-emerald-900">You&apos;re signed up!</h1>
                    <p className="font-medium text-emerald-800">{registerMutation.data.message}</p>
                    <p className="max-w-md text-sm leading-relaxed text-gray-700">
                      The EXPO team will email your judging schedule, rubric, and day-of details
                      as the event approaches.
                    </p>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => registerMutation.reset()}
                        className="border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
                      >
                        <UserPlus className="h-4 w-4" />
                        Register another judge
                      </Button>
                      <Button asChild className="bg-[#E00122] hover:bg-[#B8011C] text-white">
                        <Link to="/expo">Back to CEAS EXPO</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 text-[#E00122]">
                      <Gavel className="h-6 w-6" />
                      <CardTitle className="text-2xl text-[#333333]">
                        EXPO Judge Registration
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      Volunteer to judge senior capstone projects at CEAS EXPO. Tell us which
                      categories you&apos;d like to judge and when you&apos;re available, and
                      we&apos;ll build your schedule around it. Questions? Email{" "}
                      <a
                        href="mailto:ceasexpo@ucmail.uc.edu"
                        className="font-medium text-[#E00122] hover:underline"
                      >
                        ceasexpo@ucmail.uc.edu
                      </a>
                      .
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                      {serverError && (
                        <div
                          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                          role="alert"
                        >
                          {serverError}
                        </div>
                      )}

                      <FormSection title="About you">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">First name</Label>
                            <Input
                              id="first_name"
                              autoComplete="given-name"
                              aria-invalid={!!errors.first_name}
                              {...register("first_name", { required: "First name is required." })}
                            />
                            <FieldError message={errors.first_name?.message} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Last name</Label>
                            <Input
                              id="last_name"
                              autoComplete="family-name"
                              aria-invalid={!!errors.last_name}
                              {...register("last_name", { required: "Last name is required." })}
                            />
                            <FieldError message={errors.last_name?.message} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              autoComplete="email"
                              placeholder="name@company.com"
                              aria-invalid={!!errors.email}
                              {...register("email", {
                                required: "Email is required.",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email address.",
                                },
                              })}
                            />
                            <FieldError message={errors.email?.message} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone number</Label>
                            <Input
                              id="phone_number"
                              type="tel"
                              autoComplete="tel"
                              placeholder="555-555-5555"
                              aria-invalid={!!errors.phone_number}
                              {...register("phone_number", {
                                required: "Phone number is required.",
                              })}
                            />
                            <FieldError message={errors.phone_number?.message} />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="employer_name">Employer</Label>
                            <Input
                              id="employer_name"
                              autoComplete="organization"
                              placeholder="Company or organization"
                              aria-invalid={!!errors.employer_name}
                              {...register("employer_name", {
                                required: "Employer is required.",
                              })}
                            />
                            <FieldError message={errors.employer_name?.message} />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection
                        title="Judging categories"
                        description="Rank your top three judging categories. Your 1st choice is preferred when we build the schedule."
                      >
                        <div className="grid grid-cols-1 gap-4">
                          {CATEGORY_RANK_FIELDS.map(({ name, label }) => (
                            <Controller
                              key={name}
                              control={control}
                              name={name}
                              rules={{
                                required: `${label} is required.`,
                                validate: (value) => {
                                  if (!value) return true;
                                  const values = getValues();
                                  const others = CATEGORY_RANK_FIELDS.filter(
                                    (f) => f.name !== name
                                  ).map((f) => values[f.name]);
                                  if (others.includes(value)) {
                                    return "Each preference must be a different category.";
                                  }
                                  return true;
                                },
                              }}
                              render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                  <Label htmlFor={name}>{label}</Label>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      id={name}
                                      className="w-full border-gray-200"
                                      aria-invalid={!!fieldState.error}
                                    >
                                      <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {CATEGORY_OPTIONS.filter(
                                        (option) =>
                                          option.value === field.value ||
                                          !selectedCategories.includes(option.value)
                                      ).map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FieldError message={fieldState.error?.message} />
                                </div>
                              )}
                            />
                          ))}
                        </div>
                      </FormSection>

                      <FormSection
                        title="Availability"
                        description="Each judging round is 15 minutes. Select every round you can attend."
                      >
                        <Controller
                          control={control}
                          name="judging_timeslot"
                          rules={{
                            validate: (v) => v.length > 0 || "Select at least one timeslot.",
                          }}
                          render={({ field, fieldState }) => (
                            <div className="space-y-2">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  className="text-xs font-medium text-[#E00122] hover:underline"
                                  onClick={() =>
                                    field.onChange(
                                      field.value.length === TIMESLOT_OPTIONS.length
                                        ? []
                                        : TIMESLOT_OPTIONS.map((o) => o.value)
                                    )
                                  }
                                >
                                  {field.value.length === TIMESLOT_OPTIONS.length
                                    ? "Clear all"
                                    : "Select all"}
                                </button>
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {TIMESLOT_OPTIONS.map((option) => {
                                  const id = `timeslot-${option.value}`;
                                  return (
                                    <label
                                      key={option.value}
                                      htmlFor={id}
                                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm tabular-nums text-gray-700 transition-colors hover:bg-gray-50 has-[[data-state=checked]]:border-[#E00122]/40 has-[[data-state=checked]]:bg-red-50/50"
                                    >
                                      <Checkbox
                                        id={id}
                                        checked={field.value.includes(option.value)}
                                        onCheckedChange={(checked) =>
                                          field.onChange(
                                            toggleValue(field.value, option.value, checked === true)
                                          )
                                        }
                                      />
                                      {option.label}
                                    </label>
                                  );
                                })}
                              </div>
                              <FieldError message={fieldState.error?.message} />
                            </div>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Controller
                            control={control}
                            name="number_of_projects"
                            rules={{ required: "Choose how many projects you can judge." }}
                            render={({ field, fieldState }) => (
                              <div className="space-y-2">
                                <Label htmlFor="number_of_projects">
                                  Maximum projects to judge
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    id="number_of_projects"
                                    className="w-full border-gray-200"
                                    aria-invalid={!!fieldState.error}
                                  >
                                    <SelectValue placeholder="Select a number" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROJECT_COUNT_OPTIONS.map((n) => (
                                      <SelectItem key={n} value={n}>
                                        {n}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FieldError message={fieldState.error?.message} />
                              </div>
                            )}
                          />
                        </div>

                        <Controller
                          control={control}
                          name="is_backup_judge"
                          render={({ field }) => (
                            <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                              <Switch
                                id="is_backup_judge"
                                className="mt-0.5 data-[state=checked]:bg-[#E00122]"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <div>
                                <Label htmlFor="is_backup_judge" className="cursor-pointer">
                                  Register as a backup judge
                                </Label>
                                <p className="mt-1 text-xs text-gray-600">
                                  Backup judges aren&apos;t pre-scheduled; we&apos;ll call on you
                                  if another judge can&apos;t make it.
                                </p>
                              </div>
                            </div>
                          )}
                        />
                      </FormSection>

                      <FormSection title="Lunch">
                        <Controller
                          control={control}
                          name="is_attending_lunch"
                          render={({ field }) => (
                            <div className="flex items-center gap-3">
                              <Switch
                                id="is_attending_lunch"
                                className="data-[state=checked]:bg-[#E00122]"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label htmlFor="is_attending_lunch" className="cursor-pointer">
                                I&apos;ll attend the judges&apos; lunch
                              </Label>
                            </div>
                          )}
                        />

                        {isAttendingLunch && (
                          <Controller
                            control={control}
                            name="lunch_preference"
                            shouldUnregister
                            rules={{ required: "Choose a lunch option." }}
                            render={({ field, fieldState }) => (
                              <div className="space-y-2 sm:max-w-xs">
                                <Label htmlFor="lunch_preference">Lunch preference</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    id="lunch_preference"
                                    className="w-full border-gray-200"
                                    aria-invalid={!!fieldState.error}
                                  >
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {LUNCH_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FieldError message={fieldState.error?.message} />
                              </div>
                            )}
                          />
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="dietary_restrictions">
                            Dietary restrictions{" "}
                            <span className="font-normal text-gray-500">(optional)</span>
                          </Label>
                          <Input
                            id="dietary_restrictions"
                            placeholder="e.g. gluten-free, nut allergy"
                            maxLength={255}
                            {...register("dietary_restrictions")}
                          />
                        </div>
                      </FormSection>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={registerMutation.isPending}
                        className="w-full bg-[#E00122] hover:bg-[#B8011C] text-white"
                      >
                        {registerMutation.isPending ? "Submitting…" : "Sign up to judge"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
