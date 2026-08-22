import { Link } from "react-router-dom";
import wheelLogo from "@assets/wheel.png";
import slackLogo from "@assets/slack.svg";
import instagramLogo from "@assets/instagram.svg";
import linkedinLogo from "@assets/linkedin.svg";


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
            <img
              src={wheelLogo}
              alt=""
              className="mt-6 h-10 w-auto opacity-90"
            />
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
                  to="/expo"
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
                  to="/alumni"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Alumni
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">
              RESOURCES
            </h4>
            <Link
              to="/resources"
              className="text-[#E00122] text-sm font-medium hover:underline"
            >
              View all resources →
            </Link>
            <ul className="space-y-2 mt-3">
              <li>
                <Link
                  to="/tribunal/bylaws"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Tribunal Bylaws
                </Link>
              </li>
              <li>
                <Link
                  to="/tribunal/constitution"
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
                href="https://join.slack.com/t/ceastribunal/shared_invite/zt-3alvokcpy-~IUlKeWR2CrhY3kfomIH7Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="Slack"
              >
                <img src={slackLogo} alt="Slack" className="w-5 h-5 stroke-white invert" />
              </a>
              <a
                href="https://linkedin.com/company/ceas-tribunal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="LinkedIn"
              >
                <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://instagram.com/ceastribunal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E00122] transition-colors"
                aria-label="Instagram"
              >
                <img src={instagramLogo} alt="Instagram" className="w-5 h-5 invert" />
              </a>
            </div>
            {/* Email */}
            <a
              href="mailto:ceas.tribunal@gmail.com"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              ceas.tribunal@gmail.com
            </a>
            {/* Login Link - legacy site until Phoenix auth exists */}
            <div className="mt-4">
              <a
                href="https://tribunal.uc.edu/admin/login"
                target="_blank"
                rel="noreferrer"
                className="text-[#E00122] text-sm font-medium hover:underline"
              >
                Already an exec? Log in →
              </a>
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
