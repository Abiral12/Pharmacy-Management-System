/**
 * Smooth scroll utility with cross-browser compatibility
 * Provides smooth scrolling functionality with fallback for older browsers
 */

export interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  easing?: (t: number) => number;
}

/**
 * Easing function for smooth animation
 * Uses ease-in-out cubic bezier curve
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

/**
 * Smooth scroll to element by ID
 * @param elementId - The ID of the target element (without #)
 * @param options - Scroll options
 */
export const scrollToElement = (
  elementId: string,
  options: SmoothScrollOptions = {}
): void => {
  const {
    duration = 800,
    offset = elementId === 'support' ? 0 : 80, // No offset for footer, account for navbar on other sections
    easing = easeInOutCubic,
  } = options;

  const targetElement = document.getElementById(elementId);
  
  if (!targetElement) {
    console.warn(`Element with ID "${elementId}" not found`);
    return;
  }

  const startPosition = window.scrollY;
  const targetPosition = targetElement.offsetTop - offset;
  const distance = targetPosition - startPosition;
  
  // If distance is very small, just jump to position
  if (Math.abs(distance) < 10) {
    window.scrollTo(0, targetPosition);
    return;
  }

  let startTime: number | null = null;

  const animateScroll = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime;
    
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easing(progress);
    
    const currentPosition = startPosition + distance * easedProgress;
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  // Use native smooth scrolling if supported, otherwise use custom animation
  if ('scrollBehavior' in document.documentElement.style) {
    try {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback to custom animation if native smooth scroll fails
      requestAnimationFrame(animateScroll);
    }
  } else {
    // Custom animation for older browsers
    requestAnimationFrame(animateScroll);
  }
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