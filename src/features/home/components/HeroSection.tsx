import { Button } from "@shared/ui/button";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import coverPage from "@assets/cover_page.jpeg";

interface HeroSectionProps {
  className?: string;
}

/**
 * Art-direction focal points for object-cover.
 * Adjust % values if faces get cropped at a breakpoint.
 * Format: "x% y%" (0% left/top, 100% right/bottom).
 */
const HERO_FOCAL = {
  mobile: "50% 28%",
  tablet: "58% 30%",
  desktop: "64% 32%",
} as const;

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const handleScrollToMeetings = () => {
    const section = document.getElementById("upcoming-events");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={`w-full bg-white overflow-x-hidden ${className}`}>
      <style>{`
        .tribunal-hero-photo {
          object-position: ${HERO_FOCAL.mobile};
        }
        @media (min-width: 768px) {
          .tribunal-hero-photo {
            object-position: ${HERO_FOCAL.tablet};
          }
        }
        @media (min-width: 1024px) {
          .tribunal-hero-photo {
            object-position: ${HERO_FOCAL.desktop};
          }
        }
      `}</style>

      {/* Campaign hero — photography first, restrained chrome */}
      <div className="relative isolate min-h-[68svh] md:min-h-[75svh] lg:min-h-[82svh] overflow-hidden">
        <img
          src={coverPage}
          alt="CEAS Tribunal members at a campus event"
          className="tribunal-hero-photo absolute inset-0 h-full w-full max-w-none object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* Dark directional gradient — readable left column, photo open on the right */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 34%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.10) 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[68svh] md:min-h-[75svh] lg:min-h-[82svh] items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
            <div className="max-w-xl lg:max-w-2xl">
              <p className="text-[#E00122] text-xs sm:text-sm font-semibold uppercase tracking-[0.16em]">
                CEAS Tribunal · Est. 1908
              </p>

              <h1 className="mt-4 sm:mt-5 text-white font-bold tracking-tight text-[2.75rem] leading-[0.95] sm:text-6xl sm:leading-[0.92] lg:text-7xl lg:leading-[0.9]">
                The voice of CEAS students.
              </h1>

              <p className="mt-5 sm:mt-6 max-w-md text-base sm:text-lg leading-relaxed text-white/90">
                Representing Engineering & Applied Science students at the
                University of Cincinnati.
              </p>

              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-8 bg-[#E00122] text-white hover:bg-[#c00115] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                >
                  <Link to="/committees">Get Involved</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleScrollToMeetings}
                  className="h-12 rounded-full px-8 border-white/80 bg-white text-[#333333] hover:bg-white/90 hover:text-[#333333] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                >
                  Join General Body Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats — below the campaign hero; unchanged destinations / structure */}
      <div
        ref={statsRef}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 py-14 sm:py-16"
      >
        <div className="text-center sm:text-left">
          <div className="text-[#E00122] text-5xl font-bold tracking-tight">
            {isStatsInView && (
              <CountUp start={0} end={200} duration={2.5} suffix="+" />
            )}
          </div>
          <div className="text-gray-600 text-sm mt-2">Student Groups</div>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-[#E00122] text-5xl font-bold tracking-tight">
            {isStatsInView && (
              <CountUp start={0} end={450} duration={2.5} suffix="+" />
            )}
          </div>
          <div className="text-gray-600 text-sm mt-2">Career Fair Employers</div>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-[#E00122] text-5xl font-bold tracking-tight">
            {isStatsInView && (
              <CountUp start={0} end={115} duration={2.5} suffix="+" />
            )}
          </div>
          <div className="text-gray-600 text-sm mt-2">Years Serving CEAS</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
