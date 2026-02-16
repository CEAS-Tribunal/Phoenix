import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const HomePage = () => {
    return (
        <div className="bg-white">

            <Navbar />
            <HeroSection />
            <div id="meetings" className="bg-red-500 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold">Join our General Body meetings</h2>
                    <p className="mt-2">Based on the days and times shown below</p>
                    <button className="mt-4 bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white">
                    Join Teams Meeting
                    </button>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-red-500 pb-2 border-b-4 border-red-500 inline-block">About Us</h2>
                <p className="mt-4 text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut risus in augue luctus venenatis.
                </p>
            </div>
        
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex">
                <div className="w-2/3">
                    <h2 className="text-3xl font-bold text-red-500 pb-2 border-b-4 border-red-500 inline-block">Our Mission</h2>
                    <p className="mt-4 text-gray-700">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                    </p>
                </div>
                <div className="w-1/3 flex justify-center items-center">
                    <img src="/api/placeholder/300/200" alt="Exec Board" className="rounded-md shadow-lg" />
                </div>
            </div>
        
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-red-500 pb-2 border-b-4 border-red-500 inline-block">Our Events</h2>
                <div className="mt-6">
                    <img src="/api/placeholder/800/600" alt="Calendar" className="w-full rounded-md shadow-lg" />
                </div>
            </div>
        
            <div className="bg-red-500 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Want an opportunity to contribute within CEAS</h2>
                    <button className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white">
                        Get Involved
                    </button>
                </div>
            </div>
        
            <div className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Committees</h3>
                        <ul>
                            <li>Academic Affairs</li>
                            <li>Career Development</li>
                            <li>Communications</li>
                            <li>ESOC</li>
                            <li>EWeek</li>
                            <li>FELD</li>
                            <li>Innovation</li>
                            <li>Luau+</li>
                            <li>Special Events</li>
                            <li>Technology</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">ESOC</h3>
                        <ul>
                        <li>Baldwin Table Reservations</li>
                        <li>Funding Guide</li>
                        <li>TV Ad Submission</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Important Documents</h3>
                    <ul>
                        <li>Meeting Minutes</li>
                        <li>Student Bill of Rights</li>
                        <li>Tribunal ByLaws</li>
                        <li>Tribunal Constitution</li>
                    </ul>
                        <h3 className="text-lg font-bold mb-2 mt-4">Stay Connected</h3>
                        <ul>
                            <li>Facebook</li>
                            <li>Twitter</li>
                        </ul>
                        <h3 className="text-lg font-bold mb-2 mt-4">Already an exec member of CEAS Tribunal?</h3>
                        <div className="mt-2">
                            <a href="#" className="text-white hover:underline">Log in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage 
