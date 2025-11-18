import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tribunalLogo from "@/assets/tribunal_logo_color.png"


const NAV_LINKS = [
  { href: "/career-fair", label: "Career Fair" },
  { href: "/expo", label: "CEAS EXPO" },
  { href: "/alumni", label: "Alumni" },
  { href: "/exec", label: "Executives" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  return (
    <nav className="flex flex-row justify-between items-center mx-4 sm:mx-10 my-6 relative">
      <Link
        to="/"
        className="flex items-center hover:cursor-pointer"
        aria-label="Home"
      >
        <img
          src={tribunalLogo}
          alt="logo"
          height={40}
          width={120}
          className="h-8 sm:h-10 mr-2 z-1"
          loading="lazy"
        />
      </Link>

      <button
        className="md:hidden flex flex-col space-y-1"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Menu"
      >
        <span className="block w-6 h-0.5 bg-gray-800"></span>
        <span className="block w-6 h-0.5 bg-gray-800"></span>
        <span className="block w-6 h-0.5 bg-gray-800"></span>
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex flex-row gap-x-10 text-base justify-center">
        {NAV_LINKS.map(({ href, label }) => (
          <li
            key={href}
            onClick={() => handleNavigate(href)}
            className="hover:border-solid hover:border-b-4 hover:border-red-500 hover:cursor-pointer"
          >
            {label}
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white md:hidden z-50 shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {NAV_LINKS.map(({ href, label }) => (
              <li
                key={href}
                onClick={() => handleNavigate(href)}
                className="w-full text-center py-2 hover:bg-gray-100 hover:cursor-pointer transition"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
