import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePassword,
  formatErrorMessage,
  getAuthMeQueryKey,
  isAuthenticated,
  logoutWithQueryClient,
  refreshMe,
} from "@/services/AuthService";

function validateNewPassword(pw: string, uname: string): string | null {
  if (pw.length <= 5) {
    return "Password must be more than 5 characters.";
  }
  if (!/^[a-zA-Z0-9]+$/.test(pw)) {
    return "Password must contain only letters and numbers.";
  }
  if (pw === uname) {
    return "Password cannot be the same as your username.";
  }
  return null;
}

export default function AdminChangePasswordPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const sessionQuery = useQuery({
    queryKey: getAuthMeQueryKey(),
    queryFn: refreshMe,
    enabled: isAuthenticated(),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      }),
    onSuccess: () => {
      navigate("/admin", { replace: true });
    },
    onError: (err: unknown) => {
      setClientError(formatErrorMessage(err));
    },
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (sessionQuery.isError) {
      logoutWithQueryClient(queryClient);
      navigate("/admin/login", { replace: true });
    }
  }, [sessionQuery.isError, navigate, queryClient]);

  useEffect(() => {
    const me = sessionQuery.data;
    if (me && !me.must_change_password) {
      navigate("/admin", { replace: true });
    }
  }, [sessionQuery.data, navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="min-h-screen bg-white">
          <section className="py-16 lg:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="max-w-md mx-auto border-gray-200 shadow-sm">
                <CardContent className="py-12 text-center text-gray-600">
                  Loading your session…
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const me = sessionQuery.data;
  if (!me?.must_change_password) {
    return null;
  }

  const username = me.username;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setClientError(null);

    if (newPassword !== confirmPassword) {
      setClientError("New passwords do not match.");
      return;
    }

    const local = validateNewPassword(newPassword, username);
    if (local) {
      setClientError(local);
      return;
    }

    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#E00122] hover:underline mb-6"
                onClick={() => {
                  logoutWithQueryClient(queryClient);
                  navigate("/admin/login", { replace: true });
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 text-[#E00122]">
                    <KeyRound className="h-5 w-5" />
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      Change password
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    You must set a new password before continuing. Use more than 5 characters, letters
                    and numbers only, and do not reuse your username ({username}).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="current-pw" className="text-[#333333]">
                        Current password
                      </Label>
                      <Input
                        id="current-pw"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setClientError(null);
                        }}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="current-password"
                        disabled={mutation.isPending}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-pw" className="text-[#333333]">
                        New password
                      </Label>
                      <Input
                        id="new-pw"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setClientError(null);
                        }}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        required
                        aria-describedby="pw-rules"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pw" className="text-[#333333]">
                        Confirm new password
                      </Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setClientError(null);
                        }}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        required
                      />
                    </div>
                    <p id="pw-rules" className="text-xs text-gray-500">
                      More than 5 characters. Letters and numbers only. Cannot match your username.
                    </p>
                    {clientError && (
                      <p className="text-sm text-red-600" role="alert" aria-live="polite">
                        {clientError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
                      disabled={
                        mutation.isPending ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                    >
                      {mutation.isPending ? "Updating…" : "Update password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
