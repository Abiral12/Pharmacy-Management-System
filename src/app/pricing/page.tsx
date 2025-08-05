"use client";

import { useState } from 'react';
import { Check, X, ArrowRight, BadgeCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Animation variants
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

  const pricingPlans = [
    {
      id: 'basic',
      title: 'Basic',
      subtitle: 'For small pharmacies starting out',
      price: 'NPR 10,000',
      frequency: 'one-time + NPR 1,000/month',
      features: [
        { text: 'Up to 500 prescriptions/month', included: true },
        { text: 'Basic inventory management', included: true },
        { text: 'Patient records', included: true },
        { text: 'Basic reporting', included: true },
        { text: 'Drug interaction checks', included: false },
        { text: '24/7 phone support', included: false },
      ],
      cta: 'Get Basic Plan'
    },
    {
      id: 'premium',
      title: 'Premium',
      subtitle: 'For growing pharmacies with more needs',
      price: 'NPR 12,000',
      frequency: 'one-time + NPR 1,500/month',
      features: [
        { text: 'Up to 1,500 prescriptions/month', included: true },
        { text: 'Advanced inventory tracking', included: true },
        { text: 'Patient portal', included: true },
        { text: 'Drug interaction checks', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Multi-location support', included: false },
      ],
      cta: 'Choose Premium',
      popular: true
    },
    {
      id: 'elite',
      title: 'Elite',
      subtitle: 'Complete solution for established pharmacies',
      price: 'NPR 15,000',
      frequency: 'one-time + NPR 2,000/month',
      features: [
        { text: 'Unlimited prescriptions', included: true },
        { text: 'Multi-location management', included: true },
        { text: 'Advanced analytics', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Custom reporting', included: true },
        { text: 'API access', included: true },
      ],
      cta: 'Go Elite'
    }
  ];

  const features = [
    {
      title: "Comprehensive Inventory Management",
      description: "Track medications, set reorder points, manage suppliers, and prevent stockouts."
    },
    {
      title: "Prescription Processing",
      description: "Digital prescription management with refill reminders and patient history."
    },
    {
      title: "Billing & Insurance",
      description: "Automated billing with insurance claim processing and multiple payment options."
    },
    {
      title: "Reporting & Analytics",
      description: "Generate reports for sales, inventory, prescriptions, and financials."
    },
    {
      title: "Regulatory Compliance",
      description: "Stay compliant with pharmacy regulations and reporting requirements."
    },
    {
      title: "Multi-Device Access",
      description: "Access your pharmacy data from desktop, tablet, or mobile devices."
    }
  ];

  const benefits = [
    "Reduce medication errors with automated checks",
    "Save time with streamlined workflows",
    "Improve patient satisfaction with faster service",
    "Increase revenue with better inventory control",
    "Stay compliant with changing regulations",
    "Access your pharmacy data from anywhere"
  ];

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white">
      {/* Hero Section - Enhanced with animations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="mb-6">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BadgeCheck className="h-4 w-4" />
              Transparent Pricing
            </div>
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Flexible Pricing Plans
          </motion.h1>
          <motion.p variants={fadeIn} className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Affordable solutions for pharmacies of all sizes. 
            <span className="block mt-2 text-teal-600 font-medium">All plans include free setup and comprehensive training.</span>
          </motion.p>
        </motion.div>
      </section>

      {/* Pricing Plans - Enhanced with animations */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={fadeIn}
              className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer hover-lift card-professional ${
                plan.popular 
                  ? 'border-teal-500 shadow-professional' 
                  : 'border-gray-200 hover:border-teal-300'
              } ${
                selectedPlan === plan.id ? 'bg-teal-50' : 'bg-white'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-4">{plan.subtitle}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 block">{plan.frequency}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-teal-600 hover:bg-teal-700' 
                    : 'bg-teal-600 hover:bg-teal-700'
                } text-white`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise Option */}
        <div className="mt-12 bg-teal-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need more than Elite?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            We offer custom enterprise solutions for hospital pharmacies and chains.
          </p>
          <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-100">
            Contact for Enterprise Solution
          </Button>
        </div>
      </section>

      {/* Selected Plan Details - Enhanced with animations */}
      {selectedPlan && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {pricingPlans.find(p => p.id === selectedPlan)?.title} Plan Details
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything included in your selected plan
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {pricingPlans
                  .find(p => p.id === selectedPlan)
                  ?.features.filter(f => f.included)
                  .map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Recommended For</h3>
              <p className="text-gray-600">
                {selectedPlan === 'basic' && 
                  "Small independent pharmacies with basic needs and limited prescriptions."}
                {selectedPlan === 'premium' && 
                  "Growing pharmacies that need advanced features and moderate prescription volume."}
                {selectedPlan === 'elite' && 
                  "Large pharmacies or chains requiring unlimited prescriptions and enterprise features."}
              </p>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Features Section - Enhanced with animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">PMS Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools to manage your pharmacy efficiently
            </p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                className="bg-teal-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover-lift card-professional"
              >
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section - Enhanced with animations and teal theme */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-teal-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Use Our Software?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transform your pharmacy operations with our comprehensive solution
            </p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Key Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white rounded-lg p-6 shadow-professional card-professional">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">What Our Customers Say</h3>
              <blockquote className="text-slate-600 italic mb-4">
                "This software reduced our prescription processing time by 40% and eliminated inventory errors completely."
              </blockquote>
              <p className="font-medium text-slate-800">- City Pharmacy, Kathmandu</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section - Enhanced with teal theme and animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-teal-professional rounded-2xl p-8 sm:p-12 text-white shadow-professional-lg"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </motion.h2>
          <motion.p variants={fadeIn} className="text-xl mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your pharmacy's needs today.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 btn-professional">
              View Pricing Plans <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default PricingPage;