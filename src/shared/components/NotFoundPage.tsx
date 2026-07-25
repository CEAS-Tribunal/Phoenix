import { Link } from "react-router-dom";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import wheelLogo from "@assets/wheel.png";

const NotFoundPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center py-20">
          <img
            src={wheelLogo}
            alt=""
            className="mx-auto h-12 w-auto opacity-80 mb-6"
          />
          <p className="text-[#E00122] text-xs font-semibold uppercase tracking-wide">
            Page not found
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl font-bold text-[#333333]">
            404
          </h1>
          <p className="mt-4 text-gray-600">
            This page is under construction. Check back soon.
          </p>
          <Button
            asChild
            className="mt-8 bg-[#E00122] text-white hover:bg-[#c00115] rounded-full px-6 transition-colors"
          >
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
