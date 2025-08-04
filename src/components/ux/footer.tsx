import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="bg-gradient-to-b from-[#00FFFF] to-blue-950 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div variants={fadeIn}>
            <div className="flex items-center mb-6">
              <div className="bg-white p-2 rounded-lg mr-3">
                <HeartPulse className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold">Pharma<span className="text-blue-300">City</span></span>
            </div>
            <p className="text-blue-200 mb-6">
              The complete pharmacy management solution for modern healthcare providers.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((SocialIcon, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="icon"
                  className="text-blue-200 hover:text-white hover:bg-blue-800/50 rounded-full"
                >
                  <SocialIcon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">Quick Links</h3>
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
                    className="text-blue-200 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-300 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-blue-200">123 Medical Drive, Suite 400<br />Health City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-blue-200">(800) 555-PHAR (7427)</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-blue-200">support@pharmasoft.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-blue-300 mr-3" />
                <span className="text-blue-200">Mon-Fri: 9AM-6PM EST</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={fadeIn}>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">Stay Updated</h3>
            <p className="text-blue-200 mb-4">
              Subscribe to our newsletter for the latest updates and pharmacy management tips.
            </p>
            <form className="space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-blue-800/50 border-blue-700 text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-blue-400 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={fadeIn}
          className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-blue-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PharmaSoft. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-blue-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-blue-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}