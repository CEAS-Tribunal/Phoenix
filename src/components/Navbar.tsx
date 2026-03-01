import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/components/AdminGuard";
import { motion } from "framer-motion";
import {
  Menu,
  Home,
  Briefcase,
  Award,
  Users,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import tribunalLogo from "@/assets/tribunal_logo_color.png";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/career-fair", label: "Career Fair", icon: Briefcase },
  { href: "/expo", label: "CEAS EXPO", icon: Award },
  { href: "/committees", label: "Committees", icon: Users },
  { href: "/alumni", label: "Alumni", icon: GraduationCap },
  { href: "/admin/login", label: "Admin Login", icon: LogIn },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";
  const showLogout = isAdmin && isAdminAuthenticated();

  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate("/admin/login", { replace: true });
    setIsMenuOpen(false);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Keyboard accessibility - close menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <motion.nav
      className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="CEAS Tribunal Home"
          >
            <img
              src={tribunalLogo}
              alt="UC Logo"
              className="h-10 w-auto"
              loading="eager"
            />

          </Link>

          {/* Desktop Navigation - Center */}
          <ul
            className="hidden lg:flex items-center gap-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={`text-[15px] font-medium transition-colors duration-200 relative ${isActiveRoute(href)
                      ? "text-[#E00122]"
                      : "text-gray-700 hover:text-[#E00122]"
                    }`}
                >
                  {label}
                  {isActiveRoute(href) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E00122]"
                      layoutId="navbar-underline"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA / Log out */}
          <div className="hidden lg:block">
            {showLogout ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Log out
              </Button>
            ) : (
              <Button
                asChild
                className="bg-[#E00122] text-white hover:bg-[#c00115] rounded-full px-6 transition-colors"
              >
                <Link to="/committees">Get Involved</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-[#E00122] transition-colors"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sheet/Drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px]"
          aria-label="Mobile navigation menu"
        >
          <SheetHeader className="text-left mb-8">
            <SheetTitle className="text-[#E00122] text-2xl font-bold">
              CEAS TRIBUNAL
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2" role="navigation">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActiveRoute(href)
                    ? "bg-[#E00122] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[15px] font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile CTA / Log out */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            {showLogout ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-gray-300"
                onClick={handleLogout}
              >
                Log out
              </Button>
            ) : (
              <Button
                asChild
                className="w-full bg-[#E00122] text-white hover:bg-[#c00115] rounded-full transition-colors"
              >
                <Link to="/committees" onClick={() => setIsMenuOpen(false)}>
                  Get Involved
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.nav>
  );
};

export default Navbar;
