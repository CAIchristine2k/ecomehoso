import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {useConfig} from '~/utils/themeContext';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
  isOpen: boolean;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
  className = '',
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  className?: string;
}) {
  const {type: activeType, close} = useAside();
  const config = useConfig();
  const expanded = type === activeType;
  const asideRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Calculate header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const newHeight = header.offsetHeight;
        setHeaderHeight(newHeight);
      }
    };

    updateHeaderHeight();

    // Use throttle for scroll event to avoid excessive calculations
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHeaderHeight();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', throttledUpdate); // Header height changes on scroll

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, []);

  // Handle clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        asideRef.current &&
        !asideRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, close]);

  // Handle escape key
  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );

      // Prevent body scrolling when aside is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      abortController.abort();
      document.body.style.overflow = '';
    };
  }, [close, expanded]);

  return (
    <div
      aria-modal
      aria-hidden={!expanded}
      className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${
        expanded
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
    >
      {/* Enhanced Overlay with gradient */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-all duration-500 ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{backgroundColor: 'rgba(26,47,35,0.3)'}}
        onClick={close}
      ></div>

      {/* Cart/Aside Container */}
      <aside
        ref={asideRef}
        className={`cart-aside-container ${expanded ? 'aside-visible open' : ''} fixed right-0 shadow-2xl transition-all duration-500 ease-out flex flex-col ${className}`}
        style={{
          zIndex: 100,
          height: 'calc(100% - var(--header-height-desktop))',
          top: 'var(--header-height-desktop)',
          bottom: 0,
          left: 'auto',
          right: 0,
          width: 'var(--cart-width-desktop)',
          minWidth: 'var(--cart-min-width)',
          maxWidth: 'var(--cart-max-width-desktop)',
          transform: expanded ? 'translateX(0)' : 'translateX(100%)',
          backgroundColor: 'var(--color-cream)',
          borderLeft: '1px solid var(--color-cream-dark)',
          boxShadow: expanded
            ? '0 25px 50px -12px rgba(0,0,0,0.15)'
            : 'none',
        }}
      >
        <header
          className="flex items-center justify-between p-6 flex-shrink-0"
          style={{borderBottom: '1px solid var(--color-cream-dark)'}}
        >
          <h3 style={{fontSize: '14px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--color-charcoal)'}}>
            {heading}
          </h3>
          <button
            className="group w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{color: 'var(--color-stone)'}}
            onClick={close}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-hidden min-h-0 relative">
          <div className="relative h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');
  const isOpen = type !== 'closed';

  return (
    <AsideContext.Provider
      value={{
        type,
        isOpen,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
