"use client";

import { useState } from "react";
import { Check, X, ArrowRight, BadgeCheck } from "lucide-react";
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
      id: "basic",
      title: "Essential",
      subtitle: "Streamlined excellence for focused operations",
      price: "NPR 999",
      frequency: "/month- + NPR 10,000/month",
      features: [
        {
          text: "Up to 500 prescriptions/month with precision tracking",
          included: true,
        },
        { text: "Intelligent inventory management system", included: true },
        { text: "Comprehensive patient record management", included: true },
        { text: "Professional reporting suite", included: true },
        { text: "Advanced drug interaction monitoring", included: false },
        { text: "Dedicated 24/7 phone support", included: false },
      ],
      cta: "Start with Essential",
    },
    {
      id: "premium",
      title: "Professional",
      subtitle: "Advanced capabilities for ambitious growth",
      price: "NPR 14,999",
      frequency: "one-time + NPR 1,500/month",
      features: [
        {
          text: "Up to 1,500 prescriptions/month with smart automation",
          included: true,
        },
        { text: "AI-powered inventory optimization", included: true },
        {
          text: "Integrated patient portal with engagement tools",
          included: true,
        },
        { text: "Real-time drug interaction alerts", included: true },
        {
          text: "Priority support with dedicated account manager",
          included: true,
        },
        { text: "Multi-location enterprise management", included: false },
      ],
      cta: "Upgrade to Professional",
      popular: true,
    },
    {
      id: "elite",
      title: "Enterprise",
      subtitle: "Unlimited power for industry leaders",
      price: "NPR 15,000",
      frequency: "one-time + NPR 2,000/month",
      features: [
        {
          text: "Unlimited prescriptions with enterprise-grade performance",
          included: true,
        },
        { text: "Complete multi-location command center", included: true },
        {
          text: "Advanced business intelligence & predictive analytics",
          included: true,
        },
        { text: "White-glove 24/7 concierge support", included: true },
        { text: "Custom reporting with executive dashboards", included: true },
        { text: "Full API access with developer support", included: true },
      ],
      cta: "Claim Enterprise",
    },
  ];

  const features = [
    {
      title: "Intelligent Inventory Orchestration",
      description:
        "Our proprietary algorithms predict demand patterns, optimize stock levels, and eliminate waste through precision forecasting.",
    },
    {
      title: "Clinical Decision Support Engine",
      description:
        "Advanced prescription processing with real-time clinical validation, automated refill intelligence, and comprehensive patient journey mapping.",
    },
    {
      title: "Revenue Optimization Suite",
      description:
        "Seamless billing automation with intelligent insurance processing, dynamic pricing strategies, and multi-channel payment orchestration.",
    },
    {
      title: "Business Intelligence Platform",
      description:
        "Transform raw data into actionable insights with executive dashboards, predictive analytics, and performance optimization recommendations.",
    },
    {
      title: "Regulatory Excellence Framework",
      description:
        "Stay ahead of compliance requirements with automated reporting, audit trails, and proactive regulatory updates.",
    },
    {
      title: "Omnichannel Access Architecture",
      description:
        "Seamlessly access your pharmaceutical empire from any device, anywhere, with enterprise-grade security and real-time synchronization.",
    },
  ];

  const benefits = [
    "Eliminate medication errors through our proprietary validation engine",
    "Accelerate operations with intelligent workflow automation",
    "Deliver exceptional patient experiences with predictive service optimization",
    "Maximize profitability through advanced revenue intelligence",
    "Maintain regulatory leadership with proactive compliance monitoring",
    "Command your pharmaceutical empire from anywhere with secure cloud architecture",
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
          <motion.h1
            variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6"
          >
            Investment Tiers for Excellence
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            We've engineered three distinct pathways to pharmaceutical
            excellence, each meticulously crafted to elevate your operations.
            <span className="block mt-2 text-teal-600 font-medium">
              Every investment includes white-glove onboarding and our signature
              success guarantee.
            </span>
          </motion.p>
        </motion.div>
      </section>

      {/* Features Section - Enhanced with animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Our Technology Arsenal
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Six pillars of pharmaceutical excellence, engineered to transform
              your operations from the ground up
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
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Plans - Enhanced with animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-teal-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Investment Tiers for Excellence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your pathway to pharmaceutical leadership
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={fadeIn}
                className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer hover-lift card-professional ${
                  plan.popular
                    ? "border-teal-500 shadow-professional"
                    : "border-gray-200 hover:border-teal-300"
                } ${selectedPlan === plan.id ? "bg-teal-50" : "bg-white"}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.title}
                </h3>
                <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </span>
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
                      <span
                        className={
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-teal-600 hover:bg-teal-700"
                  } text-white`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Enterprise Option */}
          <motion.div
            variants={fadeIn}
            className="mt-12 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-8 text-center border border-teal-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Beyond Enterprise Excellence?
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              We architect bespoke pharmaceutical ecosystems for hospital
              networks, multi-chain operations, and industry pioneers who demand
              the extraordinary.
            </p>
            <Button
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-100 font-semibold"
            >
              Discuss Custom Architecture
            </Button>
          </motion.div>
        </motion.div>
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
              {pricingPlans.find((p) => p.id === selectedPlan)?.title}{" "}
              Excellence Breakdown
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your complete pharmaceutical transformation package
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
                  .find((p) => p.id === selectedPlan)
                  ?.features.filter((f) => f.included)
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
                {selectedPlan === "basic" &&
                  "Independent pharmacies ready to embrace digital transformation with precision-engineered tools for streamlined excellence."}
                {selectedPlan === "premium" &&
                  "Ambitious pharmacy operations seeking competitive advantage through AI-powered automation and advanced patient engagement."}
                {selectedPlan === "elite" &&
                  "Industry leaders and multi-location enterprises demanding unlimited scalability with white-glove concierge support."}
              </p>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Testimonials Section - Enhanced with animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Industry Leaders Choose Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join the pharmaceutical elite who have transformed their
              operations with our platform
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              className="bg-teal-50 rounded-lg p-6 shadow-professional card-professional"
            >
              <blockquote className="text-slate-600 italic mb-4">
                "We've transformed from a traditional pharmacy into a
                pharmaceutical powerhouse. Their system didn't just optimize our
                operations—it revolutionized our entire business model."
              </blockquote>
              <p className="font-medium text-slate-800">
                - Premier Healthcare Solutions, Kathmandu
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-teal-50 rounded-lg p-6 shadow-professional card-professional"
            >
              <blockquote className="text-slate-600 italic mb-4">
                "The AI-powered inventory management eliminated our stockouts
                completely. We've seen a 60% reduction in waste and 40% increase
                in profitability."
              </blockquote>
              <p className="font-medium text-slate-800">
                - MediCare Plus, Pokhara
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-teal-50 rounded-lg p-6 shadow-professional card-professional"
            >
              <blockquote className="text-slate-600 italic mb-4">
                "Their enterprise solution seamlessly connected our 12
                locations. Real-time analytics across all branches has
                transformed our decision-making."
              </blockquote>
              <p className="font-medium text-slate-800">
                - HealthFirst Chain, Lalitpur
              </p>
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
            Begin Your Transformation
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Join the pharmaceutical elite. Select your pathway to operational
            excellence and market leadership.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-teal-50 btn-professional font-semibold"
            >
              Claim Your Excellence <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default PricingPage;
