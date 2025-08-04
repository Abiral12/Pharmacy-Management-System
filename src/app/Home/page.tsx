'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Pill, Cross, LayoutDashboard, FileText, Settings, Users, ShoppingCart, BadgeCheck, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PharmacyNavbar from '@/components/ux/Navbar';
import { Footer } from '@/components/ux/footer';

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

export default function HomePage() {
  return (
    <>

    <PharmacyNavbar />
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeIn} className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Pharmacy Management Redefined
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your Pharmacy <span className="text-blue-600">Operations</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The all-in-one solution for inventory management, patient records, prescriptions, and billing. 
            Designed for pharmacies of all sizes.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Live Demo
            </Button>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-16 rounded-xl border bg-white shadow-lg overflow-hidden">
            <img 
              src="/dashboard-preview.jpg" 
              alt="PharmaSoft Dashboard Preview" 
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How PharmaSoft Works</h2>
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
          className="bg-gradient-to-r from-[#00FFFF] to-blue-500 rounded-2xl p-8 sm:p-12 text-center text-white"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
            Ready to Transform Your Pharmacy?
          </motion.h2>
          <motion.p variants={fadeIn} className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of pharmacies already using PharmaSoft to streamline their operations.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
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
    description: "Get a complete overview of your pharmacy's performance at a glance."
  },
  {
    icon: ShoppingCart,
    title: "Inventory Management",
    description: "Track stock levels, set reorder points, and manage suppliers efficiently."
  },
  {
    icon: FileText,
    title: "Prescription Tracking",
    description: "Digital prescription management with patient history and refill reminders."
  },
  {
    icon: Users,
    title: "Patient Management",
    description: "Comprehensive patient profiles with medication history and insurance details."
  },
  {
    icon: Cross,
    title: "Drug Interaction Checks",
    description: "Automated alerts for potential drug interactions and allergies."
  },
  {
    icon: BadgeCheck,
    title: "Regulatory Compliance",
    description: "Stay compliant with pharmacy regulations and reporting requirements."
  }
];

const steps = [
  {
    title: "Sign Up",
    description: "Create your account and set up your pharmacy profile in minutes."
  },
  {
    title: "Add Your Data",
    description: "Easily Add your Product on inventory and patient records."
  },
  {
    title: "Train Your Team",
    description: "Access our training resources and onboard your staff quickly."
  },
  {
    title: "Go Live",
    description: "Start managing your pharmacy more efficiently from day one."
  }
];