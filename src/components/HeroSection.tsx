import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  const handleScrollToMeetings = () => {
    const meetingsSection = document.getElementById("meetings");
    if (meetingsSection) {
      meetingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={`w-full bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        {/* Eyebrow text */}
        <div className="text-[#E00122] text-xs font-semibold uppercase tracking-wide mb-6">
          EST. 1908
        </div>

        {/* Main headline */}
        <h1 className="text-[#333333] text-[48px] lg:text-[64px] font-bold leading-tight mb-4">
          Engineering & Applied Science Tribunal
        </h1>

        {/* Subheadline */}
        <p className="text-gray-600 text-lg lg:text-xl mt-4">
          The voice of CEAS students at the University of Cincinnati
        </p>

        {/* Paragraph */}
        <p className="text-gray-600 text-base mt-6 max-w-2xl">
          We represent students on curriculum, academic standards, professional
          development, and university services. Join us to make an impact.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={handleScrollToMeetings}
            className="bg-[#E00122] text-white hover:bg-[#c00115] shadow-md transition-colors"
            size="lg"
          >
            Join General Body Meeting
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              to="/committees"
              className="border-[#E00122] text-[#E00122] hover:bg-[#E00122] hover:text-white transition-colors"
            >
              Get Involved
            </Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center sm:text-left">
            <div className="text-[#E00122] text-5xl font-bold">200+</div>
            <div className="text-gray-600 text-sm mt-2">Student Groups</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[#E00122] text-5xl font-bold">450+</div>
            <div className="text-gray-600 text-sm mt-2">
              Career Fair Employers
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[#E00122] text-5xl font-bold">115+</div>
            <div className="text-gray-600 text-sm mt-2">Years Serving CEAS</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
