/**
 * Advanced smooth scroll utility with visual feedback and animations
 * Provides smooth scrolling functionality with enhanced UX
 */

export interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
  onStart?: () => void;
  onComplete?: () => void;
  showProgress?: boolean;
}

// Advanced easing functions for different animation feels
export const easingFunctions = {
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  easeOutQuart: (t: number): number => 
    1 - (--t) * t * t * t,
  
  easeInOutQuint: (t: number): number => 
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
  easeOutExpo: (t: number): number => 
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  
  easeInOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  }
};

/**
 * Easing function for smooth animation
 * Uses ease-in-out cubic bezier curve
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

/**
 * Create and show scroll progress indicator
 */
const createScrollProgress = (): HTMLElement => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #14b8a6, #0d9488, #0f766e);
    z-index: 9999;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
  `;
  document.body.appendChild(progressBar);
  return progressBar;
};

/**
 * Add visual feedback to target element
 */
const addTargetHighlight = (element: HTMLElement): void => {
  element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  element.style.transform = 'scale(1.02)';
  element.style.boxShadow = '0 20px 25px -5px rgba(20, 184, 166, 0.1), 0 10px 10px -5px rgba(20, 184, 166, 0.04)';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.boxShadow = '';
  }, 600);
};

/**
 * Enhanced smooth scroll to element by ID with visual feedback
 * @param elementId - The ID of the target element (without #)
 * @param options - Scroll options
 */
export const scrollToElement = (
  elementId: string,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const {
      duration = 1200,
      offset = elementId === 'support' ? 0 : 80,
      easing = easingFunctions.easeInOutBack,
      onStart,
      onComplete,
      showProgress = true,
    } = options;

    const targetElement = document.getElementById(elementId);
    
    if (!targetElement) {
      console.warn(`Element with ID "${elementId}" not found`);
      resolve();
      return;
    }

    // Call onStart callback
    onStart?.();

    const startPosition = window.scrollY;
    const targetPosition = targetElement.offsetTop - offset;
    const distance = targetPosition - startPosition;
    
    // If distance is very small, just jump to position
    if (Math.abs(distance) < 10) {
      window.scrollTo(0, targetPosition);
      addTargetHighlight(targetElement);
      onComplete?.();
      resolve();
      return;
    }

    // Create progress bar if enabled
    let progressBar: HTMLElement | null = null;
    if (showProgress) {
      progressBar = createScrollProgress();
    }

    // Add loading state to body
    document.body.classList.add('smooth-scroll-loading');

    let startTime: number | null = null;

    const animateScroll = (currentTime: number): void => {
      if (startTime === null) startTime = currentTime;
      
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easing(progress);
      
      // Update progress bar
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }
      
      const currentPosition = startPosition + distance * easedProgress;
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Animation complete
        document.body.classList.remove('smooth-scroll-loading');
        
        // Remove progress bar
        if (progressBar) {
          setTimeout(() => {
            progressBar.style.opacity = '0';
            setTimeout(() => progressBar?.remove(), 300);
          }, 200);
        }
        
        // Add highlight effect to target
        addTargetHighlight(targetElement);
        
        // Call completion callback
        onComplete?.();
        resolve();
      }
    };

    // Use custom animation for better control
    requestAnimationFrame(animateScroll);
  });
};

/**
 * Check if we're on the homepage
 * @param pathname - Current pathname
 */
export const isHomePage = (pathname: string): boolean => {
  return pathname === '/' || pathname === '/Home' || pathname.includes('/Home');
};

/**
 * Handle navigation link clicks with smooth scrolling
 * @param href - The href attribute of the link
 * @param pathname - Current pathname
 * @param router - Next.js router instance (optional)
 */
export const handleNavClick = (
  href: string,
  pathname: string,
  router?: any
): void => {
  // Extract section ID from href (e.g., "/pricing" -> "pricing")
  const sectionId = href.replace('/', '');
  
  if (isHomePage(pathname)) {
    // We're on homepage, scroll to section
    scrollToElement(sectionId);
  } else {
    // We're on different page, navigate to homepage with hash
    if (router) {
      router.push(`/Home#${sectionId}`);
    } else {
      window.location.href = `/Home#${sectionId}`;
    }
  }
};