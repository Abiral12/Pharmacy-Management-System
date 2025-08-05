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
import { SignInForm } from "@/components/ux/SignInForm";
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
      const hash = window.location.hash.replace("#", "");
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
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
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
              className="absolute top-2 right-2 text-gray-400 hover:text-teal-600"
              onClick={() => setShowSignIn(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <SignInForm onClose={() => setShowSignIn(false)} />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        {/* Hero Section */}
        <section className="relative h-screen w-full">
          {/* Full-bleed background image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <Image
              fill
              src="/images/pharmacy-dashboard-pro.jpg"
              alt="Professional Pharmacy Management Dashboard Interface"
              className="object-cover object-center"
              loading="eager"
              quality={100}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content container */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col items-center justify-center h-full w-full text-center">
                <div className="space-y-8 text-white flex flex-col items-center justify-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                      Pharmacy Management
                    </span>{" "}
                    <span className="text-white">Software</span>
                  </h1>

                  <p className="text-xl text-white leading-relaxed font-light max-w-2xl">
                    Our Pharmacy Management System simplifies prescriptions, inventory, billing, and records in one secure, cloud-based platform.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <button
                      className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                      onClick={() => setShowSignIn(true)}
                    >
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button className="px-8 py-4 border-2 border-gray-200 hover:border-teal-300 text-white hover:text-teal-300 font-semibold rounded-xl transition-all duration-200 bg-white/10 hover:bg-white/20 flex items-center justify-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-teal-300" />
                      Live Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Flexible Pricing Plans
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Affordable solutions for pharmacies of all sizes
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Basic Plan */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-teal-300 transition-all">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Basic
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      For small pharmacies starting out
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-slate-800">
                        NPR 10,000
                      </span>
                      <span className="text-slate-500 block">
                        one-time + NPR 1,000/month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Up to 500 prescriptions/month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Basic inventory management</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Patient records</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Basic reporting</span>
                      </li>
                      <li className="flex items-start text-slate-400">
                        <X className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>No drug interaction checks</span>
                      </li>
                      <li className="flex items-start text-slate-400">
                        <X className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Email support only</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Get Basic Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Premium Plan (Featured) */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border-2 border-teal-500 shadow-lg relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <CardHeader className="border-b border-gray-200 bg-teal-50">
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Premium
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      For growing pharmacies with more needs
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-slate-800">
                        NPR 12,000
                      </span>
                      <span className="text-slate-500 block">
                        one-time + NPR 1,500/month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Up to 1,500 prescriptions/month</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Advanced inventory tracking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Patient portal</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Drug interaction checks</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Priority email support</span>
                      </li>
                      <li className="flex items-start text-slate-400">
                        <X className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>No multi-location support</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Choose Premium
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Elite Plan */}
              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-teal-300 transition-all">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Elite
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Complete solution for established pharmacies
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-slate-800">
                        NPR 15,000
                      </span>
                      <span className="text-slate-500 block">
                        one-time + NPR 2,000/month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Unlimited prescriptions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Multi-location management</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>24/7 phone support</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Custom reporting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>API access</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Go Elite
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Enterprise Option */}
            <motion.div
              variants={fadeIn}
              className="mt-12 bg-teal-50 rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Need more than Elite?
              </h3>
              <p className="text-slate-600 mb-4 max-w-2xl mx-auto">
                We offer custom enterprise solutions for hospital pharmacies and
                chains.
              </p>
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Contact for Enterprise Solution
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                      <div className="bg-teal-100 p-3 rounded-lg w-fit text-teal-600 mb-4">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                      <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-teal-50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                How PharmaCity Works
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
                  <div className="bg-white p-6 rounded-full shadow-md w-16 h-16 flex items-center justify-center text-teal-600 font-bold text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
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
            className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white"
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
                className="bg-white text-teal-600 hover:bg-teal-50"
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
    description: "Login on your account using provided username and password.",
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
