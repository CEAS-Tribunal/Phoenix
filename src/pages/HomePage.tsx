import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsTickerSection from "@/components/NewsTickerSection";
import AboutMissionSection from "@/components/AboutMissionSection";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NEWS_ITEMS = [
  { title: "General Body Meeting — next session Feb 20", date: "Feb 20, 2026", link: "/#upcoming-events" },
  { title: "CEAS Career Fair registration now open", date: "Mar 5, 2026", link: "/career-fair" },
  { title: "CEAS EXPO 2026 — submit your project", date: "Mar 15, 2026", link: "/expo" },
  { title: "Tribunal resources page now live", date: "Feb 2026", link: "/resources" },
];

const HomePage = () => {
    return (
        <div className="bg-white">

            <Navbar />
            <HeroSection />

            <NewsTickerSection items={NEWS_ITEMS} />
            <AboutMissionSection />
            
            {/* Upcoming Events Section */}
            <UpcomingEventsSection 
                events={[
                    {
                        date: "FEB 20, 2026",
                        title: "General Body Meeting",
                        description: "Join us for our monthly meeting to discuss upcoming events and initiatives",
                        link: "/events/general-body"
                    },
                    {
                        date: "MAR 5, 2026",
                        title: "CEAS Career Fair",
                        description: "Connect with leading employers and explore career opportunities in engineering",
                        link: "/events/career-fair"
                    },
                    {
                        date: "MAR 15, 2026",
                        title: "CEAS EXPO",
                        description: "Showcase your projects and innovations at our annual engineering expo",
                        link: "/events/ceas-expo"
                    }
                ]}
            />

            {/* CTA – home only, minimal */}
            <section className="py-12 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-[#333333] text-lg font-medium">
                        Want to contribute within CEAS?
                    </p>
                    <Button
                        asChild
                        className="mt-4 bg-[#E00122] text-white hover:bg-[#c00115] rounded-full px-6 transition-colors"
                    >
                        <Link to="/committees">Get Involved</Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default HomePage 
