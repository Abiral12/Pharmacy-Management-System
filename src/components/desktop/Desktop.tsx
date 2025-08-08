// MultipleFiles/Desktop.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/mobile.css";
import "@/styles/performance-optimized.css";
import {
  Search,
  Database,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Bell,
  X,
  CheckCircle,
  Package,
  DollarSign,
  Info,
  XCircle,
} from "lucide-react";
import BillingWindow from "../windows/BillingWindow";
import InventoryDashboard from "../inventory/InventoryDashboard";
import EnhancedWindow from "./EnhancedWindow";
import AIAssistant from "./AIAssistant";

interface Window {
  id: string;
  title: string;
  component: React.ReactNode;
  icon: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "primary" | "secondary";
  }>;
  persistent?: boolean;
}

// Professional Boot Screen Component (kept as is, as it's a distinct, self-contained component)
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(
    "Starting PharmOS Pro..."
  );
  const [showLogo, setShowLogo] = useState(false);

  const bootMessages = [
    "Starting PharmOS Pro...",
    "Loading core modules...",
    "Initializing inventory system...",
    "Connecting to database...",
    "Preparing user interface...",
    "System ready",
  ];

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 300);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1.5;
        const messageIndex = Math.floor(
          (newProgress / 100) * bootMessages.length
        );
        if (messageIndex < bootMessages.length) {
          setCurrentMessage(bootMessages[messageIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-[9999]">
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: showLogo ? 1 : 0, opacity: showLogo ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <Package className="w-16 h-16 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1 className="text-4xl font-light mb-2 tracking-wide">
            PharmOS Pro
          </h1>
          <p className="text-slate-300 mb-12 text-lg font-light">
            Professional Pharmacy Management
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-80 mx-auto"
        >
          <div className="bg-white/10 rounded-full h-1 mb-6 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-300 text-sm font-light"
          >
            {currentMessage}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

// Stock Dashboard Component (kept as is, as it's a distinct, self-contained component)
const StockDashboard = ({ onClose }: { onClose: () => void }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const stockData = {
        labels: [
          "Paracetamol",
          "Amoxicillin",
          "Omeprazole",
          "Metformin",
          "Lisinopril",
          "Aspirin",
        ],
        datasets: [
          {
            label: "Current Stock",
            data: [150, 8, 200, 5, 120, 85],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(251, 191, 36, 0.8)",
            ],
            borderColor: [
              "rgba(34, 197, 94, 1)",
              "rgba(239, 68, 68, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(239, 68, 68, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(251, 191, 36, 1)",
            ],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };

      // @ts-ignore
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: stockData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 1,
              cornerRadius: 8,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                color: "#6B7280",
                font: {
                  family:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#6B7280",
                font: {
                  family:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl p-6 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Stock Analytics
              </h2>
              <p className="text-gray-600">Real-time inventory overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">In Stock</p>
                <p className="text-2xl font-bold text-green-700">4</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-700">6</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-purple-700">₹28.5K</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Stock Levels
          </h3>
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Reports Window Component
const ReportsWindow = () => (
  <div className="p-6 h-full">
    <div className="flex items-center mb-6">
      <BarChart3 className="w-6 h-6 mr-2 text-teal-600" />
      <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
    </div>
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        Reports Coming Soon
      </h3>
      <p className="text-gray-500">
        Analytics and reporting features will be available in the next update.
      </p>
    </div>
  </div>
);

// Widget Component for reusability
interface WidgetProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  initialPosition: { x: number; y: number };
  savePosition: (id: string, position: { x: number; y: number }) => void;
  children: React.ReactNode;
  delay: number;
  gradientBg: string;
}

const DraggableWidget: React.FC<WidgetProps> = ({
  id,
  title,
  icon,
  iconBgClass,
  iconColorClass,
  initialPosition,
  savePosition,
  children,
  delay,
  gradientBg,
}) => {
  const [position, setPosition] = useState(initialPosition);

  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 220, position.x + info.offset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 140, position.y + info.offset.y)),
      };
      setPosition(newPosition);
      savePosition(id, newPosition);
    },
    [id, position, savePosition]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }} // Reduced duration
      drag
      dragMomentum={false}
      dragElastic={0.05} // Reduced elastic for less glitchy feel
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 220,
        bottom: window.innerHeight - 140,
      }}
      onDragEnd={handleDragEnd}
      style={{ x: position.x, y: position.y }}
      className="absolute bg-white/8 backdrop-blur-xl rounded-2xl p-3 border border-white/15 shadow-lg w-[220px] cursor-grab active:cursor-grabbing group relative overflow-hidden pointer-events-auto" // Adjusted opacity, blur, border, and cursor
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300" // Faster transition
        animate={{
          background: [gradientBg, gradientBg], // Minimal animation for background
        }}
        transition={{
          duration: 3, // Reduced duration
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${iconBgClass} rounded-full flex items-center justify-center`}>
              {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${iconColorClass}` })}
            </div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
          </div>
          {id === "todaysPerformance" && (
            <span className="text-green-300 text-xs">📈</span>
          )}
          {id === "lowStock" && (
            <span className="bg-orange-500/10 text-orange-300 text-xs px-2 py-1 rounded-full">
              3 items
            </span>
          )}
          {id === "expiringItems" && (
            <span className="bg-red-500/10 text-red-300 text-xs px-2 py-1 rounded-full">
              2 items
            </span>
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
};

const Desktop: React.FC = () => {
  const [isBooting, setIsBooting] = useState(false);
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [dockHovered, setDockHovered] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const [widgetPositions, setWidgetPositions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pharmacy_widget_positions");
      return saved
        ? JSON.parse(saved)
        : {
            todaysPerformance: { x: 24, y: 24 },
            lowStock: { x: 24, y: 200 },
            expiringItems: { x: 24, y: 376 },
          };
    }
    return {
      todaysPerformance: { x: 24, y: 24 },
      lowStock: { x: 24, y: 200 },
      expiringItems: { x: 24, y: 376 },
    };
  });

  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [aiEyePosition, setAiEyePosition] = useState({ x: 0, y: 0 });
  const [isUserTyping, setIsUserTyping] = useState(false);

  const saveWidgetPosition = useCallback(
    (widgetId: string, position: { x: number; y: number }) => {
      const newPositions = { ...widgetPositions, [widgetId]: position };
      setWidgetPositions(newPositions);
      localStorage.setItem(
        "pharmacy_widget_positions",
        JSON.stringify(newPositions)
      );
    },
    [widgetPositions]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (showAIAssistant) {
        setAiEyePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleKeyDown = () => setIsUserTyping(true);
    const handleKeyUp = () => setTimeout(() => setIsUserTyping(false), 1000);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [showAIAssistant]);

  const dockApps = [
    {
      id: "inventory",
      icon: <Database className="w-8 h-8 text-white" />,
      title: "Inventory",
      component: <InventoryDashboard />,
    },
    {
      id: "billing",
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Billing",
      component: <BillingWindow onClose={() => {}} />,
    },
    {
      id: "reports",
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: "Reports",
      component: <ReportsWindow />,
    },
  ];

  const playSound = useCallback((soundType: string) => {
    console.log(`Playing ${soundType} sound`);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev]);

      if (!notification.persistent) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
        }, 5000);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === " ") {
        e.preventDefault();
        setShowSpotlight(true);
        playSound("spotlight");
      }
      if (e.key === "Escape") {
        setShowSpotlight(false);
        setShowNotificationCenter(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [playSound]);

  const openWindow = useCallback(
    (app: any) => {
      const existingWindow = windows.find((w) => w.id === app.id);
      if (existingWindow) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === app.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
          )
        );
        setNextZIndex((prev) => prev + 1);
        return;
      }

      const windowOffset = windows.length * 30;
      const maxOffset = 150;
      const actualOffset = Math.min(windowOffset, maxOffset);

      const optimalWidth = Math.min(1200, window.innerWidth * 0.85);
      const optimalHeight = Math.min(800, window.innerHeight * 0.8);

      const newWindow: Window = {
        id: app.id,
        title: app.title,
        component: app.component,
        icon: app.icon,
        position: {
          x: Math.max(50, actualOffset),
          y: Math.max(80, 28 + actualOffset),
        },
        size: {
          width: optimalWidth,
          height: optimalHeight,
        },
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
      };

      setWindows((prev) => [...prev, newWindow]);
      setNextZIndex((prev) => prev + 1);
      playSound("open");
    },
    [windows, nextZIndex, playSound]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      playSound("close");
    },
    [playSound]
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
      );
      playSound("minimize");
    },
    [playSound]
  );

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId // Corrected from window.id to windowId
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              position: w.isMaximized ? w.position : { x: 0, y: 28 },
              size: w.isMaximized
                ? w.size
                : { width: window.innerWidth, height: window.innerHeight - 88 },
            }
          : w
      )
    );
  }, []);

  const bringToFront = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w))
      );
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden relative desktop-container"
      style={{
        backgroundImage: `
          radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
          linear-gradient(135deg, #0d9488 0%, #0f766e 25%, #14b8a6 50%, #0f766e 75%, #0d9488 100%)
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "default",
      }}
    >
      {/* Subtle Animated Background Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 60, // Slower movement
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 60% 70%, rgba(219, 234, 254, 0.02) 0%, transparent 50%)
          `,
          backgroundSize: "400% 400%",
        }}
      />

      {/* Minimal Floating Particles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/5 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -50,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 30 + 30, // Very slow movement
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 15,
            }}
          />
        ))}
      </div>

      {/* Subtle Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-60 h-60 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{
            x: [100, 300, 100],
            y: [200, 180, 200],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 25, // Slower duration
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full opacity-4"
          style={{
            background: "radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
            right: 100,
            top: 150,
          }}
          animate={{
            x: [-50, 50, -50],
            y: [50, -50, 50],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 28, // Slower duration
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7,
          }}
        />
      </div>

      {/* Desktop Widgets */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <DraggableWidget
          id="todaysPerformance"
          title="Today's Performance"
          icon={<DollarSign />}
          iconBgClass="bg-green-500/10"
          iconColorClass="text-green-300"
          initialPosition={widgetPositions.todaysPerformance}
          savePosition={saveWidgetPosition}
          delay={0.5}
          gradientBg="linear-gradient(45deg, rgba(34, 197, 94, 0.02), rgba(16, 185, 129, 0.01), rgba(59, 130, 246, 0.02))"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-green-300 text-xs font-medium">Total Sales</p>
              <p className="text-white text-lg font-bold">₹12,450</p>
              <p className="text-green-300 text-xs">+8.2% from yesterday</p>
              <button className="mt-2 text-xs text-blue-300 hover:text-blue-200 transition-colors pointer-events-auto">
                View Details
              </button>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-blue-300 text-xs font-medium">Net Profit</p>
              <p className="text-white text-lg font-bold">₹3,680</p>
              <p className="text-blue-300 text-xs">29.5% margin</p>
              <button className="mt-2 text-xs text-blue-300 hover:text-blue-200 transition-colors pointer-events-auto">
                View Report
              </button>
            </div>
          </div>
        </DraggableWidget>

        <DraggableWidget
          id="lowStock"
          title="Low Stock Items"
          icon={<AlertTriangle />}
          iconBgClass="bg-orange-500/10"
          iconColorClass="text-orange-300"
          initialPosition={widgetPositions.lowStock}
          savePosition={saveWidgetPosition}
          delay={0.7}
          gradientBg="linear-gradient(45deg, rgba(249, 115, 22, 0.02), rgba(239, 68, 68, 0.01), rgba(245, 158, 11, 0.02))"
        >
          <div className="space-y-2">
            {[
              { name: "Metformin 500mg", count: "2 left", critical: true },
              { name: "Amoxicillin 250mg", count: "5 left", critical: false },
              { name: "Paracetamol 500mg", count: "8 left", critical: false },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-xl p-2"
              >
                <span className="text-white text-xs">{item.name}</span>
                <span
                  className={`text-xs font-medium ${item.critical ? "text-red-300" : "text-orange-300"}`}
                >
                  {item.count}
                </span>
                <button className="ml-2 text-xs text-blue-300 hover:text-blue-200 transition-colors pointer-events-auto">
                  Order Now
                </button>
              </div>
            ))}
          </div>
        </DraggableWidget>

        <DraggableWidget
          id="expiringItems"
          title="Expiring Soon"
          icon={<XCircle />}
          iconBgClass="bg-red-500/10"
          iconColorClass="text-red-300"
          initialPosition={widgetPositions.expiringItems}
          savePosition={saveWidgetPosition}
          delay={0.9}
          gradientBg="linear-gradient(45deg, rgba(239, 68, 68, 0.02), rgba(236, 72, 153, 0.01), rgba(147, 51, 234, 0.02))"
        >
          <div className="space-y-2">
            {[
              { name: "Aspirin 325mg", expiry: "3 days", critical: true },
              { name: "Vitamin D3", expiry: "7 days", critical: false },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-xl p-2"
              >
                <span className="text-white text-xs">{item.name}</span>
                <span
                  className={`text-xs font-medium ${item.critical ? "text-red-300" : "text-orange-300"}`}
                >
                  {item.expiry}
                </span>
                <button className="ml-2 text-xs text-blue-300 hover:text-blue-200 transition-colors pointer-events-auto">
                  Adjust Stock
                </button>
              </div>
            ))}
          </div>
        </DraggableWidget>
      </div>

      {/* Enhanced Notification System */}
      <div className="absolute top-4 right-4 space-y-3 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`max-w-sm w-full backdrop-blur-xl rounded-xl shadow-lg border p-4 ${
                notification.type === "success"
                  ? "bg-green-700/70 border-green-600/15 text-white"
                  : notification.type === "warning"
                    ? "bg-orange-700/70 border-orange-600/15 text-white"
                    : notification.type === "error"
                      ? "bg-red-700/70 border-red-600/15 text-white"
                      : "bg-blue-700/70 border-blue-600/15 text-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.type === "success" && <CheckCircle className="w-5 h-5" />}
                    {notification.type === "warning" && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === "error" && <XCircle className="w-5 h-5" />}
                    {notification.type === "info" && <Info className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                    <div className="text-xs opacity-80 mt-2">
                      {notification.timestamp.toLocaleTimeString()}
                    </div>
                    {notification.actions && (
                      <div className="flex space-x-2 mt-3">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                              action.variant === "primary"
                                ? "bg-white/30 hover:bg-white/40 text-white"
                                : "bg-white/20 hover:bg-white/30 text-white/95"
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
            className="w-full bg-white/20 backdrop-blur-xl border border-white/25 rounded-xl p-3 text-white hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.button>
        )}
      </div>

      {/* Notification Center */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-4 right-4 w-80 max-h-96 bg-white/95 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowNotificationCenter(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === "success"
                              ? "bg-green-100 text-green-600"
                              : notification.type === "warning"
                                ? "bg-orange-100 text-orange-600"
                                : notification.type === "error"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {notification.type === "success" && <CheckCircle className="w-4 h-4" />}
                          {notification.type === "warning" && <AlertTriangle className="w-4 h-4" />}
                          {notification.type === "error" && <XCircle className="w-4 h-4" />}
                          {notification.type === "info" && <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="text-xs text-gray-400 mt-2">
                            {notification.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Spotlight Search */}
      <AnimatePresence>
        {showSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[9998] flex items-start justify-center pt-32"
            onClick={() => setShowSpotlight(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl w-96 p-6 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search PharmOS applications..."
                  className="flex-1 bg-transparent outline-none text-lg text-gray-900 placeholder-gray-500"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                {dockApps.map((app) => (
                  <button
                    key={app.id}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    onClick={() => {
                      openWindow(app);
                      setShowSpotlight(false);
                    }}
                  >
                    <div className="p-2 bg-teal-100 rounded-lg">{app.icon}</div>
                    <span className="font-medium text-gray-800">{app.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows */}
      <AnimatePresence>
        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <EnhancedWindow
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onBringToFront={() => bringToFront(window.id)}
              onUpdatePosition={(newPosition) => {
                setWindows((prev) =>
                  prev.map((w) =>
                    w.id === window.id ? { ...w, position: newPosition } : w
                  )
                );
              }}
              onUpdateSize={(newSize) => {
                setWindows((prev) =>
                  prev.map((w) =>
                    w.id === window.id ? { ...w, size: newSize } : w
                  )
                );
              }}
            />
          ))}
      </AnimatePresence>

      {/* AI Assistant with Enhanced Visuals */}
      <AnimatePresence>
        {showAIAssistant && (
          <AIAssistant
            eyePosition={aiEyePosition}
            isUserTyping={isUserTyping}
            onClose={() => setShowAIAssistant(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Professional Dock */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 1.5, // Reduced delay
          duration: 0.6, // Reduced duration
          type: "spring",
          stiffness: 150, // Less stiff
          damping: 18, // More damping
        }}
        onMouseEnter={() => setDockHovered(true)}
        onMouseLeave={() => setDockHovered(false)}
      >
        <motion.div
          className="flex items-center space-x-3 bg-white/15 backdrop-blur-3xl rounded-full px-6 py-4 border border-white/25 shadow-2xl"
          animate={{
            scale: dockHovered ? 1.01 : 1, // Subtler scale
            y: dockHovered ? -6 : 0, // Subtler y movement
            boxShadow: dockHovered
              ? "0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08)"
              : "0 8px 20px -4px rgba(0, 0, 0, 0.15)",
          }}
          transition={{
            type: "spring",
            stiffness: 200, // Less stiff
            damping: 20, // More damping
          }}
        >
          {dockApps.map((app, index) => {
            const isOpen = windows.some((w) => w.id === app.id);
            const isMinimized = windows.some(
              (w) => w.id === app.id && w.isMinimized
            );

            return (
              <motion.button
                key={app.id}
                className="relative group"
                onClick={() => openWindow(app)}
                whileHover={{
                  scale: 1.08, // Subtler scale
                  y: -6, // Subtler y movement
                  transition: {
                    type: "spring",
                    stiffness: 300, // Less stiff
                    damping: 15, // More damping
                  },
                }}
                whileTap={{
                  scale: 0.98, // Subtler scale
                  transition: { duration: 0.08 }, // Faster transition
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.7 + index * 0.08, // Reduced delay increment
                  duration: 0.5, // Reduced duration
                  ease: "easeOut",
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden"
                  style={{
                    background:
                      app.id === "inventory"
                        ? "linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)"
                        : app.id === "billing"
                          ? "linear-gradient(135deg, #fb923c, #f97316, #ea580c)"
                          : app.id === "reports"
                            ? "linear-gradient(135deg, #c084fc, #a78bfa, #8b5cf6)"
                            : "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)",
                  }}
                  whileHover={{
                    boxShadow:
                      "0 15px 30px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {/* Animated Background Glow - Minimal */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50"
                    style={{
                      background: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.1, 0],
                    }}
                    transition={{
                      duration: 2.5, // Reduced duration
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {/* Icon with minimal animation */}
                  <div className="relative z-10">{app.icon}</div>
                  {/* Reflection Effect - Minimal */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/5" />
                </motion.div>

                {/* Enhanced Tooltip */}
                <motion.div
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap border border-white/10"
                  initial={{ y: 5, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {app.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-black/80" />
                </motion.div>

                {/* Enhanced Running Indicator */}
                {isOpen && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                        isMinimized ? "bg-amber-400" : "bg-white"
                      }`}
                      animate={{
                        scale: isMinimized ? [1, 1.05, 1] : 1,
                        boxShadow: isMinimized
                          ? [
                              "0 0 0 0 rgba(251, 191, 36, 0.1)",
                              "0 0 0 3px rgba(251, 191, 36, 0)",
                              "0 0 0 0 rgba(251, 191, 36, 0)",
                            ]
                          : "0 0.5px 1px rgba(0, 0, 0, 0.08)",
                      }}
                      transition={{
                        duration: isMinimized ? 1.5 : 0,
                        repeat: isMinimized ? Infinity : 0,
                      }}
                    />
                  </motion.div>
                )}

                {/* Hover Ripple Effect - Minimal */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{
                    scale: [0, 1.05],
                    opacity: [0, 0.04, 0],
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                  }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Desktop;
