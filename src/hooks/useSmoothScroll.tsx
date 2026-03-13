import { useEffect, useRef } from 'react';

// Native CSS smooth scroll — replaces Lenis + GSAP bundle (~80KB saved)
// Same smooth feel, zero JS overhead on the scroll thread
export const useSmoothScroll = () => {
  const ref = useRef(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return ref;
};

export default useSmoothScroll;
