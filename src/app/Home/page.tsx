"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Cross,
  LayoutDashboard,
  FileText,
  Users,
  ShoppingCart,
  BadgeCheck,
  PlayCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Footer } from "@/components/ux/footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import PharmacyNavbar from "@/components/ux/Navbar";
import {SignInForm} from "@/components/ux/SignInForm";
import { scrollToElement } from "@/utils/smoothScroll";
import "@/styles/smoothScroll.css";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [showSignIn, setShowSignIn] = useState(false);

  // Handle URL hash navigation on page load
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          scrollToElement(hash, { duration: 1000 });
        }, 100);
      }
    };

    // Handle initial load
    handleHashNavigation();

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleHashNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  return (
    <>
      <PharmacyNavbar onSignInClick={() => setShowSignIn(true)} />
      {/* Modal with backdrop blur */}
      {showSignIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
            onClick={() => setShowSignIn(false)}
          />
          <div className="relative z-10">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600"
              onClick={() => setShowSignIn(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <SignInForm onClose={() => setShowSignIn(false)} />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Premium Enterprise Hero Section */}
        <section className="relative h-screen ">
          {/* Full-width, full-height background image with overlay */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <Image
              width={1520}
              height={920}
              src="/images/pharmacy-dashboard-pro.jpg"
              alt="Professional Pharmacy Management Dashboard Interface"
              className=" object-cover object-center"
              loading="eager"
            />
            {/* Darker overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content container centered vertically and horizontally */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col items-center justify-center h-full w-full text-center">
                {/* Content Column */}
                <div className="space-y-8 text-white flex flex-col items-center justify-center">
                  {/* Enhanced Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                      Pharmacy Management
                    </span>{" "}
                    <span className="text-white">Software</span>
                  </h1>

                  {/* Professional Subhead */}
                  <p className="text-xl text-white leading-relaxed font-light max-w-2xl">
                    Our Pharmacy Management System simplifies prescriptions, inventory, billing, and records in one secure, cloud-based platform.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                      onClick={() => setShowSignIn(true)}
                    >
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button className="px-8 py-4 border-2 border-gray-200 hover:border-blue-300 text-white hover:text-blue-300 font-semibold rounded-xl transition-all duration-200 bg-white/10 hover:bg-white/20 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-blue-300" />
                      Live Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexible Pricing Plans</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Affordable solutions for pharmacies of all sizes
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Basic Plan */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-blue-300 transition-all">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-xl font-bold text-gray-900">Basic</CardTitle>
                    <CardDescription>
                      For small pharmacies starting out
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">NPR 10,000</span>
                      <span className="text-gray-500 block">one-time + NPR 1,000/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Up to 500 prescriptions/month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Basic inventory management</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Patient records</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Basic reporting</span>
                      </li>
                      <li className="flex items-start text-gray-400">
                        <X className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>No drug interaction checks</span>
                      </li>
                      <li className="flex items-start text-gray-400">
                        <X className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Email support only</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Basic Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Premium Plan (Featured) */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border-2 border-blue-500 shadow-lg relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <CardHeader className="border-b border-gray-200 bg-blue-50">
                    <CardTitle className="text-xl font-bold text-gray-900">Premium</CardTitle>
                    <CardDescription>
                      For growing pharmacies with more needs
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">NPR 12,000</span>
                      <span className="text-gray-500 block">one-time + NPR 1,500/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Up to 1,500 prescriptions/month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Advanced inventory tracking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Patient portal</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Drug interaction checks</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Priority email support</span>
                      </li>
                      <li className="flex items-start text-gray-400">
                        <X className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>No multi-location support</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Choose Premium
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Elite Plan */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-blue-300 transition-all">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-xl font-bold text-gray-900">Elite</CardTitle>
                    <CardDescription>
                      Complete solution for established pharmacies
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">NPR 15,000</span>
                      <span className="text-gray-500 block">one-time + NPR 2,000/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Unlimited prescriptions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Multi-location management</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>24/7 phone support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Custom reporting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>API access</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Go Elite
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Enterprise Option */}
            <motion.div 
              variants={fadeIn}
              className="mt-12 bg-blue-50 rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need more than Elite?</h3>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                We offer custom enterprise solutions for hospital pharmacies and chains.
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Contact for Enterprise Solution
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to run your pharmacy efficiently
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="bg-blue-100 p-3 rounded-lg w-fit text-blue-600 mb-4">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How PharmaCity Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple steps to transform your pharmacy management
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="bg-white p-6 rounded-full shadow-md w-16 h-16 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center text-white"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
              Ready to Transform Your Pharmacy?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Join hundreds of pharmacies already using PharmaCity to streamline
              their operations.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}

const features = [
  {
    icon: LayoutDashboard,
    title: "Intuitive Dashboard",
    description:
      "Get a complete overview of your pharmacy's performance at a glance.",
  },
  {
    icon: ShoppingCart,
    title: "Inventory Management",
    description:
      "Track stock levels, set reorder points, and manage suppliers efficiently.",
  },
  {
    icon: FileText,
    title: "Prescription Tracking",
    description:
      "Digital prescription management with patient history and refill reminders.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Comprehensive patient profiles with medication history and insurance details.",
  },
  {
    icon: Cross,
    title: "Drug Interaction Checks",
    description:
      "Automated alerts for potential drug interactions and allergies.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description:
      "Stay compliant with pharmacy regulations and reporting requirements.",
  },
];

const steps = [
  {
    title: "Sign In",
    description:
      "Login on your account using provided username and password.",
  },
  {
    title: "Add Your Data",
    description: "Easily add your Data on inventory and patient records.",
  },
  {
    title: "Train Your Team",
    description:
      "Access our training resources and onboard your staff quickly.",
  },
  {
    title: "Go Live",
    description: "Start managing your pharmacy more efficiently from day one.",
  },
];
