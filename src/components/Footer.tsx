const Footer = () => {
    return (
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
)}

export default Footer;