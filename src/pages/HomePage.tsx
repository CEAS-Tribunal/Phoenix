import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutMissionSection from "@/components/AboutMissionSection";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import Footer from "@/components/Footer";

const HomePage = () => {
    return (
        <div className="bg-white">

            <Navbar />
            <HeroSection />
            
            {/* Meetings Section */}
            <div id="meetings" className="bg-red-500 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold">Join our General Body meetings</h2>
                    <p className="mt-2">Based on the days and times shown below</p>
                    <button className="mt-4 bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white">
                    Join Teams Meeting
                    </button>
                </div>
            </div>
            
            {/* About and Mission Section */}
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
            
            {/* CTA Section */}
            <div className="bg-red-500 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold">Want an opportunity to contribute within CEAS</h2>
                    <button className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white">
                        Get Involved
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default HomePage 
