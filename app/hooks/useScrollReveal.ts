import {useEffect} from 'react';

/**
 * Lightweight scroll-reveal hook using IntersectionObserver + MutationObserver.
 * Adds 'revealed' class to elements with [data-reveal] when they enter viewport.
 *
 * - GPU-accelerated (CSS handles transform + opacity)
 * - Respects prefers-reduced-motion
 * - Watches for dynamically added elements (SPA navigation)
 * - Triggers once per element (no re-hide on scroll up)
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      },
    );

    // Observe existing elements
    const observeAll = () => {
      document
        .querySelectorAll('[data-reveal]:not(.revealed)')
        .forEach((el) => observer.observe(el));
    };

    observeAll();

    // Watch for new elements added to DOM (SPA navigation)
    const mutationObserver = new MutationObserver((mutations) => {
      let hasNewElements = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          hasNewElements = true;
          break;
        }
      }
      if (hasNewElements) {
        // Small delay to let React finish rendering
        requestAnimationFrame(observeAll);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
