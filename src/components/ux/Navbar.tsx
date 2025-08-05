import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiLogIn } from "react-icons/fi";
import {
  handleNavClick,
  isHomePage,
  scrollToElement,
} from "@/utils/smoothScroll";

interface PharmacyNavbarProps {
  onSignInClick?: () => void;
}

const PharmacyNavbar = ({ onSignInClick }: PharmacyNavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolling, setIsScrolling] = useState(false);
  const pathname = usePathname();

  // Enhanced scroll handler with active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section for navigation highlighting
      if (isHomePage(pathname)) {
        const sections = ["features", "pricing", "support"];
        const currentSection = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, activeSection]);

  // Enhanced navigation click handler with visual feedback
  const handleEnhancedNavClick = async (section: string) => {
    setIsScrolling(true);

    try {
      await scrollToElement(section, {
        duration: 1200,
        showProgress: true,
        onStart: () => {
          // Add visual feedback when scrolling starts
          document.body.style.cursor = "wait";
        },
        onComplete: () => {
          // Remove visual feedback when scrolling completes
          document.body.style.cursor = "";
          setActiveSection(section);
          setIsScrolling(false);
        },
      });
    } catch (error) {
      console.error("Scroll animation failed:", error);
      setIsScrolling(false);
      document.body.style.cursor = "";
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/50 backdrop-blur-lg shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo with Animation */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <div
                className={`flex items-center justify-center rounded-lg ${
                  scrolled ? "bg-teal-600" : "bg-white"
                } p-2 shadow-md transition-all duration-300 group-hover:scale-110`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 logo-icon ${
                    scrolled ? "text-white" : "text-teal-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <span
                className={`ml-3 text-xl font-bold ${
                  scrolled ? "text-teal-600" : "text-white"
                }`}
              >
                myPharma
                <span
                  className={`${scrolled ? "text-black" : "text-teal-300"}`}
                >
                  City
                </span>
              </span>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation with Animations */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {isHomePage(pathname) ? (
                <button
                  onClick={() => handleEnhancedNavClick("features")}
                  disabled={isScrolling}
                  className={`nav-link nav-button magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    activeSection === "features" ? "active nav-active" : ""
                  } ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  } ${
                    isScrolling ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  Features
                </button>
              ) : (
                <Link
                  href="/Home#features"
                  className={`nav-link magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  }`}
                >
                  Features
                </Link>
              )}
              {isHomePage(pathname) ? (
                <button
                  onClick={() => handleEnhancedNavClick("pricing")}
                  disabled={isScrolling}
                  className={`nav-link nav-button magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    activeSection === "pricing" ? "active nav-active" : ""
                  } ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  } ${
                    isScrolling ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  Pricing
                </button>
              ) : (
                <Link
                  href="/Home#pricing"
                  className={`nav-link magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  }`}
                >
                  Pricing
                </Link>
              )}
              <Link
                href="/demo"
                className={`nav-link magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                  scrolled
                    ? "text-gray-700 hover:bg-teal-50"
                    : "text-white hover:bg-teal-600/20"
                }`}
              >
                Live Demo
              </Link>
              {isHomePage(pathname) ? (
                <button
                  onClick={() => handleEnhancedNavClick("support")}
                  disabled={isScrolling}
                  className={`nav-link nav-button magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    activeSection === "support" ? "active nav-active" : ""
                  } ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  } ${
                    isScrolling ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                >
                  Support
                </button>
              ) : (
                <Link
                  href="/Home#support"
                  className={`nav-link magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-50"
                      : "text-white hover:bg-teal-600/20"
                  }`}
                >
                  Support
                </Link>
              )}
              <Link
                href="/blog"
                className={`nav-link magnetic-hover px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                  scrolled
                    ? "text-gray-700 hover:bg-teal-50"
                    : "text-white hover:bg-teal-600/20"
                }`}
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Enhanced CTA Buttons with Animations */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => scrollToElement('pricing', { duration: 1000 })}
              className="cta-button ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 hover:shadow-lg glow-focus"
            >
              Buy Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 -mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onSignInClick}
              className="cta-button ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-teal-600 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50 transition-all duration-300 glow-focus group"
            >
              <FiLogIn className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${
                  scrolled ? "text-gray-700" : "text-black"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu with Staggered Animations */}
      <div
        className={`md:hidden mobile-menu ${
          mobileMenuOpen
            ? "mobile-menu-enter-active"
            : "mobile-menu-exit-active"
        } ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div
          className={`backdrop-blur-transition px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
            scrolled
              ? "bg-white/50 backdrop-blur-lg shadow-lg blurred"
              : "bg-white/90 backdrop-blur-lg blurred"
          }`}
        >
          {isHomePage(pathname) ? (
            <button
              onClick={() => {
                handleEnhancedNavClick("features");
                setMobileMenuOpen(false);
              }}
              className="mobile-menu-item block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Features
            </button>
          ) : (
            <Link
              href="/Home#features"
              className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Features
            </Link>
          )}
          {isHomePage(pathname) ? (
            <button
              onClick={() => {
                handleEnhancedNavClick("pricing");
                setMobileMenuOpen(false);
              }}
              className="mobile-menu-item block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Pricing
            </button>
          ) : (
            <Link
              href="/Home#pricing"
              className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Pricing
            </Link>
          )}
          <Link
            href="/demo"
            className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
          >
            Live Demo
          </Link>
          {isHomePage(pathname) ? (
            <button
              onClick={() => {
                handleEnhancedNavClick("support");
                setMobileMenuOpen(false);
              }}
              className="mobile-menu-item block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Support
            </button>
          ) : (
            <Link
              href="/Home#support"
              className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              Support
            </Link>
          )}
          <Link
            href="/blog"
            className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
          >
            Blog
          </Link>
          <button
            onClick={() => {
              scrollToElement('pricing', { duration: 1000 });
              setMobileMenuOpen(false);
            }}
            className="mobile-menu-item cta-button block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 mt-2 transition-all duration-300"
          >
            Buy Now
          </button>
          <button
            type="button"
            onClick={onSignInClick}
            className="mobile-menu-item cta-button block w-full text-center px-3 py-2 rounded-md text-base font-medium text-teal-600 bg-white border border-teal-600 hover:bg-teal-50 mt-2 flex items-center justify-center transition-all duration-300 group"
          >
            <FiLogIn className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PharmacyNavbar;
