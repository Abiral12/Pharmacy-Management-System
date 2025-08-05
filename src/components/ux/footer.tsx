import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Footer() {
  return (
    <motion.footer 
      id="support"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-teal-800 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div variants={fadeIn}>
            <div className="flex items-center mb-6">
              <div className="bg-white p-2 rounded-lg mr-3">
                <HeartPulse className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-xl font-bold">Pharma<span className="text-teal-300">City</span></span>
            </div>
            <p className="text-teal-200 mb-6">
              The complete pharmacy management solution for modern healthcare providers.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-full"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-full"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-full"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-full"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-teal-800 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Case Studies', href: '/case-studies' },
                { name: 'Support Center', href: '/support' },
                { name: 'API Documentation', href: '/docs' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-teal-200 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-teal-800 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-300 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-teal-200">123 Medical Drive, Suite 400<br />Health City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-teal-300 mr-3" />
                <span className="text-teal-200">(800) 555-PHAR (7427)</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-teal-300 mr-3" />
                <span className="text-teal-200">support@pharmasoft.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-teal-300 mr-3" />
                <span className="text-teal-200">Mon-Fri: 9AM-6PM EST</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-teal-800 pb-2">Stay Updated</h3>
            <p className="text-teal-200 mb-4">
              Subscribe to our newsletter for the latest updates and pharmacy management tips.
            </p>
            <form className="space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-teal-800/50 border-teal-700 text-white placeholder-teal-300 focus:ring-2 focus:ring-teal-500"
              />
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-500 text-white"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-teal-400 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={fadeIn}
          className="border-t border-teal-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-teal-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PharmaSoft. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-teal-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-teal-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-teal-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}