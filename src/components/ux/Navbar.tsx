import Link from 'next/link';
import { useState, useEffect } from 'react';

const PharmacyNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/50 backdrop-blur-lg shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className={`flex items-center justify-center rounded-lg ${scrolled ? 'bg-blue-600' : 'bg-white'} p-2 shadow-md`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${scrolled ? 'text-white' : 'text-blue-600'}`}
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
              <span className={`ml-3 text-xl font-bold ${scrolled ? 'text-blue-600' : 'text-gray-700'}`}>
                Pharma<span className="text-blue-400">City</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/features"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-black hover:bg-blue-600/20'}`}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-black hover:bg-blue-600/20'}`}
              >
                Pricing
              </Link>
              <Link
                href="/demo"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-black hover:bg-blue-600/20'}`}
              >
                Live Demo
              </Link>
              <Link
                href="/support"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-black hover:bg-blue-600/20'}`}
              >
                Support
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-black hover:bg-blue-600/20'}`}
              >
                Blog
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/buy-now"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg"
            >
              Buy Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 -mr-1 h-4 w-4"
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
            </Link>
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
                className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-black'}`}
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
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
          <Link
            href="/features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Pricing
          </Link>
          <Link
            href="/demo"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Live Demo
          </Link>
          <Link
            href="/support"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Support
          </Link>
          <Link
            href="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Blog
          </Link>
          <Link
            href="/buy-now"
            className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 mt-2"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PharmacyNavbar;