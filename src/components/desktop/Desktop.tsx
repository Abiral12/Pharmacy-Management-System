"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecycleBinWindow from '@/components/windows/RecycleBinWindow';
import { RecycleBinManager } from '@/utils/recycleBinManager';
import { 
  Users, 
  Minimize2,
  Maximize2,
  X,
  Wifi,
  Battery,
  Search,
  Trash2,
  Terminal,
  AppWindow,
  Database,
  BarChart3,
  Pill,
  Plus,
  AlertTriangle,
  TrendingUp,
  Bell
} from 'lucide-react';
import PrescriptionsWindow from '../windows/PrescriptionsWindow';
import PatientsWindow from '../windows/PatientsWindow';

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

interface DesktopIcon {
  id: string;
  title: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  windowComponent: React.ReactNode;
}

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [time, setTime] = useState(new Date());
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [dockHovered, setDockHovered] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  // Enhanced wallpapers with professional pharmacy themes
  const wallpapers = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  ];

  // Helper functions for recycle bin
  const handleItemRestore = (restoredData: any, type: 'patient' | 'prescription' | 'inventory') => {
    console.log('Restoring item:', restoredData, type);
    // In a real app, this would restore the item to the appropriate data store
  };

  const handleBulkRestore = (restoredItems: any[]) => {
    console.log('Bulk restoring items:', restoredItems);
    // In a real app, this would restore multiple items
  };

  // Simple placeholder components for missing windows
  const InventoryWindow = () => (
    <div className="p-6 h-full">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 mr-2 text-teal-600" />
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
      </div>
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Inventory Coming Soon</h3>
        <p className="text-gray-500">Inventory management features will be available in the next update.</p>
      </div>
    </div>
  );

  const ReportsWindow = () => (
    <div className="p-6 h-full">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-6 h-6 mr-2 text-teal-600" />
        <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
      </div>
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Reports Coming Soon</h3>
        <p className="text-gray-500">Analytics and reporting features will be available in the next update.</p>
      </div>
    </div>
  );

  const PharmTerminalWindow = () => (
    <div className="p-6 h-full bg-black text-green-400 font-mono">
      <div className="flex items-center mb-6">
        <Terminal className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">PharmOS Terminal</h2>
      </div>
      <div className="space-y-2">
        <div>$ pharmOS --version</div>
        <div>PharmOS Terminal v1.0.0</div>
        <div>$ system status</div>
        <div>✓ Database: Connected</div>
        <div>✓ Inventory: Synced</div>
        <div>✓ Prescriptions: Active</div>
        <div>✓ Patients: 0 registered</div>
        <div className="mt-4">$ _</div>
      </div>
    </div>
  );

  // Core pharmacy-focused desktop icons
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'inventory',
      title: 'Inventory Manager',
      icon: <Database className="w-8 h-8 text-white" />,
      position: { x: 50, y: 80 },
      windowComponent: <InventoryWindow />
    },
    {
      id: 'prescriptions',
      title: 'Prescriptions',
      icon: <Pill className="w-8 h-8 text-white" />,
      position: { x: 50, y: 180 },
      windowComponent: <PrescriptionsWindow />
    },
    {
      id: 'patients',
      title: 'Patient Records',
      icon: <Users className="w-8 h-8 text-white" />,
      position: { x: 50, y: 280 },
      windowComponent: <PatientsWindow onClose={() => {}} />
    },
    {
      id: 'reports',
      title: 'Analytics & Reports',
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      position: { x: 50, y: 380 },
      windowComponent: <ReportsWindow />
    },
    {
      id: 'terminal',
      title: 'PharmOS Terminal',
      icon: <Terminal className="w-8 h-8 text-white" />,
      position: { x: 150, y: 80 },
      windowComponent: <PharmTerminalWindow />
    },
    {
      id: 'trash',
      title: 'Recycle Bin',
      icon: <Trash2 className="w-8 h-8 text-white" />,
      position: { x: 150, y: 180 },
      windowComponent: <RecycleBinWindow onItemRestore={handleItemRestore} onBulkRestore={handleBulkRestore} />
    }
  ];

  // Streamlined dock applications
  const dockApps = [
    { id: 'inventory', icon: <Database className="w-8 h-8 text-white" />, title: 'Inventory' },
    { id: 'prescriptions', icon: <Pill className="w-8 h-8 text-white" />, title: 'Prescriptions' },
    { id: 'patients', icon: <Users className="w-8 h-8 text-white" />, title: 'Patients' },
    { id: 'reports', icon: <BarChart3 className="w-8 h-8 text-white" />, title: 'Reports' },
    { id: 'terminal', icon: <Terminal className="w-8 h-8 text-white" />, title: 'Terminal' }
  ];

  // Sound effects
  const playSound = (soundType: string) => {
    console.log(`Playing ${soundType} sound`);
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setShowSpotlight(true);
        playSound('spotlight');
      }
      if (e.key === 'Escape') {
        setShowSpotlight(false);
        setShowNotificationCenter(false);
        setShowControlCenter(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWindow = (icon: DesktopIcon) => {
    const existingWindow = windows.find(w => w.id === icon.id);
    if (existingWindow) {
      setWindows(prev => prev.map(w => 
        w.id === icon.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
      return;
    }

    const newWindow: Window = {
      id: icon.id,
      title: icon.title,
      component: icon.windowComponent,
      icon: icon.icon,
      position: { x: 200 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 900, height: 650 },
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    playSound('open');
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    playSound('close');
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
    playSound('minimize');
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { 
            ...w, 
            isMaximized: !w.isMaximized,
            position: w.isMaximized ? w.position : { x: 0, y: 28 },
            size: w.isMaximized ? w.size : { width: window.innerWidth, height: window.innerHeight - 88 }
          } 
        : w
    ));
  };

  const bringToFront = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      style={{ background: wallpapers[wallpaperIndex], cursor: 'default' }}
    >
      {/* Professional Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 text-white text-sm z-50">
        <div className="flex items-center space-x-6">
          <button 
            className="font-bold hover:bg-white/10 px-2 py-1 rounded transition-colors"
            onClick={() => setShowSpotlight(true)}
          >
            💊 PharmOS Pro
          </button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">File</button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">Edit</button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">View</button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">Tools</button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">Help</button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
            onClick={() => setShowControlCenter(!showControlCenter)}
          >
            <Wifi className="w-4 h-4" />
          </button>
          <button className="hover:bg-white/10 px-2 py-1 rounded transition-colors">
            <Battery className="w-4 h-4" />
          </button>
          <button 
            className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
            onClick={() => setShowSpotlight(true)}
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            className="hover:bg-white/10 px-2 py-1 rounded transition-colors"
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </button>
        </div>
      </div>

      {/* Real-time Monitoring Widgets */}
      <div className="absolute top-10 right-4 space-y-3 z-40">
        {/* Low Stock Alert Widget */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg border border-red-400/30 min-w-[250px]"
        >
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Low Stock Alert</span>
          </div>
          <p className="text-xs">Metformin 500mg: Only 5 units remaining</p>
        </motion.div>

        {/* Prescription Alert Widget */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg border border-blue-400/30 min-w-[250px]"
        >
          <div className="flex items-center space-x-2 mb-1">
            <Bell className="w-4 h-4" />
            <span className="font-semibold text-sm">Prescription Ready</span>
          </div>
          <p className="text-xs">RX001 for Ram Sharma is ready for pickup</p>
        </motion.div>
      </div>

      {/* Enhanced Spotlight Search */}
      <AnimatePresence>
        {showSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-start justify-center pt-32"
            onClick={() => setShowSpotlight(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-96 p-6 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search PharmOS applications..."
                  className="flex-1 bg-transparent outline-none text-lg"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                {desktopIcons.map((icon) => (
                  <button
                    key={icon.id}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-white/50 rounded-lg transition-colors text-left"
                    onClick={() => {
                      openWindow(icon);
                      setShowSpotlight(false);
                    }}
                  >
                    <div className="p-2 bg-teal-100 rounded-lg">
                      {icon.icon}
                    </div>
                    <span className="font-medium text-gray-800">{icon.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Desktop Icons */}
      {desktopIcons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute cursor-pointer select-none"
          style={{ left: icon.position.x, top: icon.position.y }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onDoubleClick={() => openWindow(icon)}
        >
          <div className="flex flex-col items-center p-3 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
            <div className="mb-2 p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              {icon.icon}
            </div>
            <span className="text-white text-sm font-medium text-center drop-shadow-lg">
              {icon.title}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Windows */}
      <AnimatePresence>
        {windows.filter(w => !w.isMinimized).map((window) => (
          <WindowComponent
            key={window.id}
            window={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => bringToFront(window.id)}
            onMove={(newPosition) => {
              setWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, position: newPosition } : w
              ));
            }}
            onResize={(newSize) => {
              setWindows(prev => prev.map(w => 
                w.id === window.id ? { ...w, size: newSize } : w
              ));
            }}
          />
        ))}
      </AnimatePresence>

      {/* Professional Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="flex items-end space-x-3 bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-2xl"
          onMouseEnter={() => setDockHovered(true)}
          onMouseLeave={() => setDockHovered(false)}
        >
          {dockApps.map((app) => {
            const isOpen = windows.some(w => w.id === app.id);
            const isMinimized = windows.some(w => w.id === app.id && w.isMinimized);
            
            return (
              <motion.button
                key={app.id}
                className="relative group"
                whileHover={{ scale: dockHovered ? 1.3 : 1.1, y: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const icon = desktopIcons.find(i => i.id === app.id);
                  if (icon) {
                    openWindow(icon);
                  }
                }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/30 shadow-lg ${
                  isOpen ? 'bg-white/40 backdrop-blur-sm' : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                }`}>
                  {app.icon}
                </div>
                
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {app.title}
                </div>
                
                {isOpen && (
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                    isMinimized ? 'bg-yellow-400' : 'bg-white'
                  } shadow-lg`} />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

// Professional Window Component
interface WindowComponentProps {
  window: Window;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
}

const WindowComponent: React.FC<WindowComponentProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {window.icon}
          <span className="font-medium text-gray-800">{window.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
          />
          <button
            onClick={onMaximize}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          />
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {window.component}
      </div>
    </motion.div>
  );
};

export default Desktop;