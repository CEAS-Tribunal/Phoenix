import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1F2937] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Branding */}
          <div>
            <h3 className="text-white text-xl font-bold">CEAS TRIBUNAL</h3>
            <p className="text-gray-400 text-sm mt-2">
              Serving students since 1908
            </p>
            {/* UC Logo Placeholder */}
            <div className="mt-6 w-[150px] h-[40px] bg-gray-700 rounded"></div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/career-fair"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Career Fair
                </Link>
              </li>
              <li>
                <Link
                  to="/ceas-expo"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  CEAS EXPO
                </Link>
              </li>
              <li>
                <Link
                  to="/committees"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Committees
                </Link>
              </li>
              <li>
                <Link
                  to="/executives"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Executives
                </Link>
              </li>
              <li>
                <Link
                  to="/meeting-minutes"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Meeting Minutes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">
              RESOURCES
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/baldwin-table"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Baldwin Table Reservations
                </Link>
              </li>
              <li>
                <Link
                  to="/funding-guide"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Funding Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/tv-ad"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  TV Ad Submission
                </Link>
              </li>
              <li>
                <Link
                  to="/bill-of-rights"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Student Bill of Rights
                </Link>
              </li>
              <li>
                <Link
                  to="/bylaws"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Tribunal ByLaws
                </Link>
              </li>
              <li>
                <Link
                  to="/constitution"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Tribunal Constitution
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">
              STAY CONNECTED
            </h4>
            {/* Social Icons */}
            <div className="flex gap-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            {/* Email */}
            <a
              href="mailto:tribunal@uc.edu"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              tribunal@uc.edu
            </a>
            {/* Login Link */}
            <div className="mt-4">
              <Link
                to="/login"
                className="text-[#E00122] text-sm font-medium hover:underline"
              >
                Already an exec? Log in →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} CEAS Tribunal, University of Cincinnati. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
