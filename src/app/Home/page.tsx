"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Pill,
  Cross,
  LayoutDashboard,
  FileText,
  Users,
  ShoppingCart,
  BadgeCheck,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PharmacyNavbar from "@/components/ux/Navbar";

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
  return (
    <>
      <PharmacyNavbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Premium Enterprise Hero Section */}


<section className="relative h-screen bg-white">
  {/* Full-width, full-height background image with overlay */}
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    <img
      src="/images/pharmacy-dashboard-pro.jpg"
      alt="Professional Pharmacy Management Dashboard Interface"
      className="w-full h-full object-cover object-center"
      loading="eager"
    />
    {/* Darker overlay for better text contrast */}
    <div className="absolute inset-0 bg-black/30"></div>
  </div>

  {/* Content container centered vertically and horizontally */}
  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Content Column - takes full width unless you want side-by-side layout */}
        <div className="w-full space-y-8 text-white">
          {/* Enhanced Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-700">
              Pharmacy Management
            </span>{" "}
            <span className="text-white">Software</span>
          </h1>

          {/* Professional Subhead */}
          <p className="text-xl text-gray-200 leading-relaxed font-light max-w-2xl">
            Our Pharmacy Management System simplifies prescriptions, inventory, billing, and records in one secure, cloud-based platform—boosting efficiency and care.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-8 py-4 border-2 border-gray-200 hover:border-blue-300 text-white hover:text-blue-300 font-semibold rounded-xl transition-all duration-200 bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <PlayCircle className="h-5 w-5 mr-2 text-blue-300" />
              Live Demo
            </button>
          </div>
        </div>

        {/* Optional: If you want to keep the image as a separate element floating over the background */}
        {/* <div className="w-full lg:w-1/2 order-1 lg:order-1">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            <img
              src="/images/pharmacy-dashboard-pro.jpg"
              alt="Dashboard details"
              className="w-full h-auto"
            />
          </div>
        </div> */}
      </div>
    </div>
  </div>
</section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
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
                How PharmaSoft Works
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
              Join hundreds of pharmacies already using PharmaSoft to streamline
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
    title: "Sign Up",
    description:
      "Create your account and set up your pharmacy profile in minutes.",
  },
  {
    title: "Import Your Data",
    description: "Easily migrate your existing inventory and patient records.",
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
