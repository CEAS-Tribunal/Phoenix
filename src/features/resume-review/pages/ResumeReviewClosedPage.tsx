import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import Navbar from '@shared/components/layout/Navbar';
import Footer from '@shared/components/layout/Footer';
import { Button } from '@shared/ui/button';

export default function ResumeReviewClosedPage({
  audience,
}: {
  audience: 'employer' | 'student';
}) {
  const label = audience === 'employer' ? 'Employer' : 'Student';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          <LockKeyhole className="mx-auto mb-5 h-12 w-12 text-[#E00122]" />
          <h1 className="text-3xl font-bold text-[#333333]">
            {label} registration is closed
          </h1>
          <p className="mt-3 text-gray-600">
            Resume Review Day {label.toLowerCase()} registration is not currently available.
          </p>
          <Button asChild className="mt-6 bg-[#E00122] hover:bg-[#B8011C]">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}