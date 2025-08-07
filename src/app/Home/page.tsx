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
  ChevronDown,
  ChevronUp,
  Pill,
  Database,
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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setTimeout(() => {
          scrollToElement(hash, { duration: 1000 });
        }, 100);
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, []);

  return (
    <>
      <PharmacyNavbar onSignInClick={() => setShowSignIn(true)} />
      
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
        <section className="relative min-h-screen overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src="/images/pharmacy-dashboard-pro.jpg"
              alt="Modern pharmacy management dashboard"
              fill
              className="object-cover w-full h-full"
              loading="eager"
              quality={90}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-teal-800/50"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>

          <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-center max-w-3xl mx-auto space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg"
              >
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
                Enterprise-Grade Solution
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  <span className="block text-white drop-shadow-lg">Pharmacy</span>
                  <span className="block text-white drop-shadow-lg">Management</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-300 to-emerald-300 drop-shadow-lg">
                    System
                  </span>
                </h1>
                
                <div className="flex items-center justify-center space-x-3 text-teal-200">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent"></div>
                  <span className="text-sm font-medium uppercase tracking-widest">
                    Professional Grade
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-5"
              >
                <p className="text-base sm:text-lg text-white/90 leading-relaxed font-light max-w-2xl mx-auto drop-shadow-md">
                  Streamline prescriptions, automate inventory, and enhance
                  patient care with Nepal's most trusted pharmacy management
                  platform.
                </p>
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 max-w-lg mx-auto">
                  <p className="text-sm text-white/80">
                    <span className="text-emerald-300 font-semibold">95% error reduction</span>
                    <span className="text-white/60 mx-2">•</span>
                    <span className="text-blue-300 font-semibold">3+ hours saved daily</span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-base backdrop-blur-sm shadow-xl border border-blue-700/50"
                  onClick={() => setShowSignIn(true)}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-teal-400/50 hover:border-teal-300 text-white hover:text-teal-100 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-teal-500/30 text-base backdrop-blur-sm hover:bg-teal-800/20"
                >
                  <PlayCircle className="h-5 w-5 mr-2 text-teal-300 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="pt-8"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 max-w-2xl mx-auto">
                  <p className="text-sm text-white/80 mb-4 font-medium">Trusted by 500+ pharmacies across Nepal</p>
                  <div className="flex items-center justify-center space-x-6 flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-300" />
                      </div>
                      <span className="text-sm font-medium text-white/80">FDA Compliant</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-sm font-medium text-white/80">ISO Certified</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                        <Cross className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="text-sm font-medium text-white/80">Medical Grade</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-6 rounded-full shadow-2xl hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 opacity-40 hover:opacity-100"
              onClick={() => console.log("Demo clicked")}
            >
              <PlayCircle className="w-12 h-12 text-teal-300" />
            </motion.button>
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
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Everything Your Pharmacy Needs
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Comprehensive tools designed specifically for Nepali pharmacies.
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
                Our proven 4-step process gets your pharmacy running efficiently.
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

        {/* System Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BadgeCheck className="h-4 w-4" />
                Professional System
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
                Complete Pharmacy Management
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Streamline your pharmacy operations with our comprehensive system.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-teal-300 transition-all">
                  <CardHeader className="text-center">
                    <div className="bg-teal-100 p-3 rounded-lg w-fit mx-auto text-teal-600 mb-4">
                      <Pill className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Prescription Management
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Complete prescription processing with validation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Digital prescription processing</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Drug interaction checks</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Automated refill reminders</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="h-full border-2 border-teal-500 shadow-lg relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CORE
                  </div>
                  <CardHeader className="text-center bg-teal-50">
                    <div className="bg-teal-100 p-3 rounded-lg w-fit mx-auto text-teal-600 mb-4">
                      <Users className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Patient Records
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Comprehensive patient data management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Complete patient profiles</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Medical history tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="h-full border border-gray-200 hover:border-teal-300 transition-all">
                  <CardHeader className="text-center">
                    <div className="bg-teal-100 p-3 rounded-lg w-fit mx-auto text-teal-600 mb-4">
                      <Database className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Inventory Control
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Real-time stock management and tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6 text-sm text-slate-700">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Real-time stock tracking</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Low stock alerts</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-12 bg-teal-50 rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Plus Advanced Analytics & Reports
              </h3>
              <Button
                className="bg-teal-600 text-white hover:bg-teal-700"
                onClick={() => setShowSignIn(true)}
              >
                Access Full System
              </Button>
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
              Join pharmacies across Nepal saving hours daily and reducing errors.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg font-semibold"
                onClick={() => setShowSignIn(true)}
              >
                Start Free 30-Day Trial <ArrowRight className="ml-2 h-5 w-5" />
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
                Trusted by Pharmacies Across Nepal
              </h2>
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <div className="inline-block border-2 border-teal-200 rounded-lg px-6 py-4 mb-6 bg-teal-50">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Frequently Asked Questions
                </h2>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeIn} className="mb-4">
                  <Card className="border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                    <motion.div
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-semibold text-slate-800 text-left">
                            {faq.question}
                          </CardTitle>
                          <motion.div
                            animate={{ rotate: openFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown className="h-5 w-5 text-teal-600 flex-shrink-0" />
                          </motion.div>
                        </div>
                      </CardHeader>
                    </motion.div>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openFAQ === index ? "auto" : 0,
                        opacity: openFAQ === index ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="pt-0 pb-6">
                        <motion.p
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="text-slate-600 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.p>
                      </CardContent>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="text-center mt-12">
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Contact Support
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
      <Suspense fallback={<div className="h-96 bg-teal-800 animate-pulse"></div>}>
        <Footer />
      </Suspense>
    </>
  );
}

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-Time Dashboard",
    description: "Monitor sales, inventory levels, and key metrics instantly.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Inventory Control",
    description: "Never run out of stock with automated reorder alerts.",
  },
  {
    icon: FileText,
    title: "Digital Prescriptions",
    description: "Process prescriptions 3x faster with digital tracking.",
  },
  {
    icon: Users,
    title: "Complete Patient Records",
    description: "Secure patient profiles with medication history.",
  },
  {
    icon: Cross,
    title: "Safety First Alerts",
    description: "Prevent dangerous drug interactions with real-time alerts.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description: "Stay compliant with Nepal's pharmacy regulations.",
  },
];

const testimonials = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Owner & Pharmacist",
    pharmacy: "Kathmandu Medical Pharmacy",
    quote: "This system transformed our operations completely. We've reduced prescription errors by 98%.",
  },
  {
    name: "Sita Gurung",
    role: "Pharmacy Manager",
    pharmacy: "Pokhara Health Center",
    quote: "The inventory management is incredible. We never run out of essential medicines anymore.",
  },
  {
    name: "Bikash Thapa",
    role: "Head Pharmacist",
    pharmacy: "Chitwan Community Pharmacy",
    quote: "Customer service is outstanding and the training was comprehensive.",
  },
];

const steps = [
  {
    title: "Quick Setup & Account Creation",
    description: "Create your secure account in 2 minutes.",
  },
  {
    title: "Import Your Existing Data",
    description: "Seamlessly migrate your current inventory and patient records.",
  },
  {
    title: "Free Staff Training & Support",
    description: "Get your entire team up to speed with our training program.",
  },
  {
    title: "Go Live & Start Saving",
    description: "Begin processing prescriptions faster from day one.",
  },
];

const faqs = [
  {
    question: "How long does it take to set up the system?",
    answer: "Our team can have your pharmacy management system up and running within 24 hours.",
  },
  {
    question: "Is my pharmacy data secure and backed up?",
    answer: "Absolutely. We use bank-level encryption and store all data in secure servers.",
  },
  {
    question: "Can I import my existing patient and inventory data?",
    answer: "Yes! We support data import from most pharmacy management systems.",
  },
  {
    question: "What happens if I need help or have technical issues?",
    answer: "All plans include comprehensive support with free training for your staff.",
  },
  {
    question: "Does the system work with Nepal's pharmacy regulations?",
    answer: "Yes, our system is specifically designed for Nepali pharmacies.",
  },
  {
    question: "Can I try the system before committing to a plan?",
    answer: "Absolutely! We offer a 30-day free trial with full access to all features.",
  },
];