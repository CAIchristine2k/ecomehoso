import React from 'react';
import {Aside} from './Aside';
import {useAside} from './Aside';

/**
 * A specialized version of Aside that is guaranteed to appear on the right side
 * This component forces right-side positioning for the cart
 */
export function CartAside({
  children,
  heading = 'CART',
}: {
  children: React.ReactNode;
  heading?: string;
}) {
  const {type, close} = useAside();
  const expanded = type === 'cart';

  return (
    <div
      aria-modal
      aria-hidden={!expanded}
      className={`fixed inset-0 transition-all duration-500 ease-out ${
        expanded
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      style={{zIndex: 9999}}
    >
      {/* CART PANEL - FULL SCREEN ABOVE EVERYTHING */}
      <div
        className={`fixed inset-0
          backdrop-blur-xl shadow-2xl
          transition-all duration-500 ease-out
          flex flex-col ${expanded ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          zIndex: 9999,
          backgroundColor: 'var(--color-cream)',
        }}
      >
        <main className="flex-1 pt-4 overflow-hidden bg-gradient-to-b from-background/80 to-background text-text min-h-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 pointer-events-none"></div>
          <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
