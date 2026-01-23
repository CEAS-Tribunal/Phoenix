import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HomePage = () => {
    return (
        <div className="bg-white">

            <Navbar />
            <div className="bg-red-500 py-8 text-white">
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
            
            <Footer />
        </div>
    );
}

export default HomePage 