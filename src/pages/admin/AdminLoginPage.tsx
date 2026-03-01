import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdminAuthenticated, isAdminAuthenticated } from "@/components/AdminGuard";

const HARDCODED_EMAIL = "123";
const HARDCODED_PASSWORD = "123";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  if (isAdminAuthenticated()) {
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      setAdminAuthenticated(true);
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid email or password. Use 123 / 123 for demo.");
    }
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
                    Sign in with your executive credentials to access the admin dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-[#333333]">
                        Email
                      </Label>
                      <Input
                        id="admin-email"
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-200 focus-visible:ring-[#E00122]/50"
                        autoComplete="username"
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
                    >
                      Sign in
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
