import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatErrorMessage,
  getAuthMeQueryKey,
  isAuthenticated,
  login,
  logoutWithQueryClient,
  refreshMe,
} from "@/services/AuthService";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (result) => {
      queryClient.setQueryData(getAuthMeQueryKey(), result.me);
      if (result.mustChangePassword) {
        navigate("/admin/change-password", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    },
    onError: (err: unknown) => {
      setError(formatErrorMessage(err));
    },
  });

  useEffect(() => {
    if (!isAuthenticated()) return;
    let cancelled = false;
    void (async () => {
      try {
        const me = await refreshMe();
        if (cancelled) return;
        queryClient.setQueryData(getAuthMeQueryKey(), me);
        if (!me.is_staff) {
          logoutWithQueryClient(queryClient);
          navigate("/", { replace: true });
          return;
        }
        if (me.must_change_password) {
          navigate("/admin/change-password", { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      } catch {
        if (!cancelled) {
          logoutWithQueryClient(queryClient);
          navigate("/admin/login", { replace: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, queryClient]);

  if (isAuthenticated()) {
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    loginMutation.mutate();
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
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 text-[#E00122]">
                    <LogIn className="h-5 w-5" />
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Staff sign-in: use your executive username (6+2) and password (same as Django admin).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username" className="text-[#333333]">
                        Username
                      </Label>
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="Your 6+2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="username"
                        disabled={loginMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-[#333333]">
                        Password
                      </Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="current-password"
                        disabled={loginMutation.isPending}
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-600" role="alert">
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
                      disabled={loginMutation.isPending || !username.trim() || !password}
                    >
                      {loginMutation.isPending ? "Signing in…" : "Sign in"}
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
