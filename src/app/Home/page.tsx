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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect, lazy, Suspense } from "react";
import PharmacyNavbar from "@/components/ux/Navbar";
import { SignInForm } from "@/components/ux/SignInForm";
import { scrollToElement } from "@/utils/smoothScroll";
import "@/styles/smoothScroll.css";

// Lazy load non-critical components
const Footer = lazy(() =>
  import("@/components/ux/footer").then((module) => ({
    default: module.Footer,
  }))
);

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
  const router = useRouter();

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
          {/* Optimized background image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <Image
              fill
              src="/images/pharmacy-dashboard-pro.jpg"
              alt="Modern pharmacy management dashboard showing real-time inventory, prescription tracking, and analytics"
              className="object-cover object-center"
              loading="eager"
              quality={85}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content container */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col items-center justify-center h-full w-full text-center">
                <div className="space-y-8 text-white flex flex-col items-center justify-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                    Transform Your Pharmacy Operations
                  </h1>

                  <p className="text-xl text-white leading-relaxed font-light max-w-2xl">
                    Streamline prescriptions, automate inventory, and enhance
                    patient care with Nepal's most trusted pharmacy management
                    platform. Reduce errors by 95% and save 3+ hours daily.
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

        {/* Pricing Section - Enhanced Professional Design */}
        <section
          id="pricing"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BadgeCheck className="h-4 w-4" />
                Transparent Pricing
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                Choose Your Perfect Plan
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Transparent pricing with no hidden fees. Start small and scale
                as you grow.
                <span className="block mt-2 text-teal-600 font-medium">
                  All plans include free setup and comprehensive training.
                </span>
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
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => router.push("/pricing")}
                    >
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
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => router.push("/pricing")}
                    >
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
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => router.push("/pricing")}
                    >
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

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Trusted by 500+ Pharmacies Across Nepal
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                See how our platform is transforming pharmacy operations
                nationwide
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-slate-600 mb-4 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-lg mr-4">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {testimonial.role}
                          </p>
                          <p className="text-sm text-slate-500">
                            {testimonial.pharmacy}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                Everything Your Pharmacy Needs
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Comprehensive tools designed specifically for Nepali pharmacies.
                Reduce manual work, prevent errors, and focus on patient care.
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
                      <CardTitle className="text-slate-800">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {feature.description}
                      </CardDescription>
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
                Get Started in Minutes, Not Months
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our proven 4-step process gets your pharmacy running efficiently
                in under 24 hours. No technical expertise required.
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
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">
                      {step.title}
                    </h3>
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
              Start Your Free Trial Today
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Join 500+ pharmacies across Nepal saving 3+ hours daily and
              reducing errors by 95%. No setup fees, free training included.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg font-semibold"
              >
                Start Free 30-Day Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
      <Suspense
        fallback={<div className="h-96 bg-teal-800 animate-pulse"></div>}
      >
        <Footer />
      </Suspense>
    </>
  );
}

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-Time Dashboard",
    description:
      "Monitor sales, inventory levels, and key metrics instantly. Make data-driven decisions with live insights.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Inventory Control",
    description:
      "Never run out of stock again. Automated reorder alerts and supplier management save time and money.",
  },
  {
    icon: FileText,
    title: "Digital Prescriptions",
    description:
      "Process prescriptions 3x faster with digital tracking, patient history, and automated refill reminders.",
  },
  {
    icon: Users,
    title: "Complete Patient Records",
    description:
      "Secure patient profiles with medication history, allergies, and insurance details in one place.",
  },
  {
    icon: Cross,
    title: "Safety First Alerts",
    description:
      "Prevent dangerous drug interactions with real-time alerts. Protect patients and reduce liability.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description:
      "Stay compliant with Nepal's pharmacy regulations. Automated reporting and audit trails included.",
  },
];

const testimonials = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Owner & Pharmacist",
    pharmacy: "Kathmandu Medical Pharmacy",
    quote:
      "This system transformed our operations completely. We've reduced prescription errors by 98% and our staff loves how intuitive it is. Best investment we've made.",
  },
  {
    name: "Sita Gurung",
    role: "Pharmacy Manager",
    pharmacy: "Pokhara Health Center",
    quote:
      "The inventory management is incredible. We never run out of essential medicines anymore, and the automated reordering saves us hours every week.",
  },
  {
    name: "Bikash Thapa",
    role: "Head Pharmacist",
    pharmacy: "Chitwan Community Pharmacy",
    quote:
      "Customer service is outstanding and the training was comprehensive. Our entire team was up and running in just one day. Highly recommended!",
  },
];

const steps = [
  {
    title: "Quick Setup & Account Creation",
    description:
      "Create your secure account in 2 minutes. Our team handles the technical setup while you focus on your pharmacy.",
  },
  {
    title: "Import Your Existing Data",
    description:
      "Seamlessly migrate your current inventory, patient records, and supplier information. We support all major formats.",
  },
  {
    title: "Free Staff Training & Support",
    description:
      "Get your entire team up to speed with our comprehensive training program. Live support available during transition.",
  },
  {
    title: "Go Live & Start Saving",
    description:
      "Begin processing prescriptions faster, managing inventory smarter, and serving patients better from day one.",
  },
];
