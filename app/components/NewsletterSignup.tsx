import React, {useState} from 'react';
import {Check} from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setSubmitted(true);
    setError('');
  };

  return (
    <section
      id="newsletter"
      style={{
        position: 'relative',
        padding: '100px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/preset/bghero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(26,47,35,0.5) 0%, rgba(26,47,35,0.4) 50%, rgba(26,47,35,0.6) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {!submitted ? (
          <>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase' as const,
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Rejoignez la communauté
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 400,
                lineHeight: 1.4,
                color: 'white',
                marginBottom: '12px',
              }}
            >
              -10% sur votre première commande
            </h2>
            <p style={{fontFamily: "'Noto Serif JP', serif", fontSize: '0.75rem', color: 'var(--color-matcha-light)', letterSpacing: '0.3em', marginTop: '6px'}}>
              ニュースレター
            </p>

            <p
              style={{
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.7,
                marginBottom: '36px',
              }}
            >
              Inscrivez-vous et recevez votre code de réduction ainsi que nos nouveautés en avant-première.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '60px',
                padding: '6px 6px 6px 28px',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="E-MAIL"
                aria-label="Adresse e-mail pour la newsletter"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  fontWeight: 400,
                }}
              />
              <button
                type="submit"
                className="btn-press"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '60px',
                  color: 'white',
                  padding: '14px 28px',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--ease-premium)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                S'inscrire
              </button>
            </form>

            {error && (
              <div
                style={{
                  color: '#ff9999',
                  fontSize: '12px',
                  marginTop: '12px',
                }}
              >
                {error}
              </div>
            )}
          </>
        ) : (
          <div style={{padding: '32px 0'}}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                marginBottom: '24px',
              }}
            >
              <Check style={{width: '24px', height: '24px', color: 'white'}} />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'white',
                marginBottom: '12px',
              }}
            >
              Merci pour votre inscription
            </h3>

            <p
              style={{
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
              }}
            >
              Vous recevrez bientôt nos dernières actualités et offres
              exclusives.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
