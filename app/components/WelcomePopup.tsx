import {useState, useEffect} from 'react';
import {X} from 'lucide-react';

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed
    const dismissed = sessionStorage.getItem('welcome-popup-dismissed');
    if (dismissed) return;

    // Show after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('welcome-popup-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'popupFadeIn 0.3s ease',
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          width: 'min(90vw, 420px)',
          backgroundColor: 'var(--color-cream)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          animation: 'popupSlideIn 0.4s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-stone)',
            zIndex: 2,
            padding: '4px',
          }}
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top accent bar */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(to right, var(--color-matcha-mid), var(--color-matcha-light))',
          }}
        />

        {/* Content */}
        <div style={{padding: 'clamp(28px, 6vw, 44px) clamp(24px, 5vw, 40px)', textAlign: 'center'}}>
          {/* Japanese text */}
          <p style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: '0.8rem',
            color: 'var(--color-matcha-mid)',
            letterSpacing: '0.3em',
            marginBottom: '16px',
          }}>
            ようこそ
          </p>

          {/* Heading */}
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: 'var(--color-charcoal)',
            lineHeight: 1.2,
            marginBottom: '8px',
          }}>
            Bienvenue
          </h2>

          {/* Discount badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px 0',
            padding: '16px 32px',
            backgroundColor: 'var(--color-matcha-mid)',
            borderRadius: '8px',
          }}>
            <span style={{
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              -10%
            </span>
          </div>

          <p style={{
            color: 'var(--color-charcoal)',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            fontWeight: 400,
            lineHeight: 1.6,
            marginBottom: '6px',
          }}>
            sur votre première commande
          </p>

          <p style={{
            color: 'var(--color-stone)',
            fontSize: '13px',
            fontWeight: 300,
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            avec le code
          </p>

          {/* Promo code */}
          <div style={{
            display: 'inline-block',
            padding: '12px 28px',
            border: '1.5px dashed var(--color-matcha-mid)',
            borderRadius: '6px',
            backgroundColor: 'var(--color-cream-warm)',
            marginBottom: '28px',
          }}>
            <span style={{
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'var(--color-matcha-mid)',
            }}>
              BIENVENUE10
            </span>
          </div>

          {/* CTA button */}
          <div>
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '14px 28px',
                backgroundColor: 'var(--color-matcha-mid)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              J'en profite
            </button>
          </div>

          <p style={{
            color: 'var(--color-stone)',
            fontSize: '11px',
            fontWeight: 300,
            marginTop: '16px',
            opacity: 0.7,
          }}>
            Offre valable sur votre première commande
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}} />
    </>
  );
}
