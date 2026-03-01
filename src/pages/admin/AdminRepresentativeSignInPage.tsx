import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LOCATION_OPTIONS = [
  { value: "rec-center", label: "REC Center" },
  { value: "tuc-great-hall", label: "TUC Great Hall" },
] as const;

export default function AdminRepresentativeSignInPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [boothLocation, setBoothLocation] = useState("");
  const [location, setLocation] = useState<string>("");
  const [signedIn, setSignedIn] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (location) {
      setSignedIn(true);
    }
  }

  function handleSignInAnother() {
    setName("");
    setCompany("");
    setTitle("");
    setEmail("");
    setBoothLocation("");
    setLocation("");
    setSignedIn(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#E00122] hover:underline mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Link>

              <Card className="max-w-md mx-auto border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 text-[#E00122]">
                    <UserPlus className="h-6 w-6" />
                    <CardTitle className="text-2xl">Representative Sign In</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    Career Fair representative sign-in by location.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {signedIn ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 text-center py-4"
                    >
                      <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-[#333333]">
                        You have successfully signed in.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-md"
                        onClick={handleSignInAnother}
                      >
                        Sign in another representative
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Title"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booth">Booth Location (ex: A15)</Label>
                        <Input
                          id="booth"
                          value={boothLocation}
                          onChange={(e) => setBoothLocation(e.target.value)}
                          placeholder="ex: A15"
                          className="border-gray-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Where are you located?</Label>
                        <RadioGroup
                          value={location}
                          onValueChange={setLocation}
                          className="flex gap-6"
                        >
                          {LOCATION_OPTIONS.map((loc) => (
                            <div key={loc.value} className="flex items-center gap-2">
                              <RadioGroupItem value={loc.value} id={loc.value} />
                              <Label htmlFor={loc.value} className="font-normal cursor-pointer">
                                {loc.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#E00122] text-white hover:bg-[#B8011C] rounded-md"
                        disabled={!location}
                      >
                        Sign in
                      </Button>
                    </form>
                  )}
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
