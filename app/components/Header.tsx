import React, {useState, useEffect} from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Music,
} from 'lucide-react';
import {Link, useLocation} from 'react-router';
import {Logo} from './Logo';
import {useConfig} from '~/utils/themeContext';
import {useCart} from '~/providers/CartProvider';
import {useAside} from './Aside';

export function Header() {
  const config = useConfig();
  const {totalQuantity, openCart} = useCart();
  const {open} = useAside();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const cartCount = totalQuantity || 0;

  const socialLinks = Object.entries(config.socialLinks || {})
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      icon: getSocialIcon(platform),
      link: url,
    }));

  function getSocialIcon(platform: string) {
    switch (platform) {
      case 'instagram':
        return Instagram;
      case 'twitter':
        return Twitter;
      case 'youtube':
        return Youtube;
      case 'facebook':
        return Facebook;
      case 'tiktok':
        return Music;
      default:
        return Instagram;
    }
  }

  // Pages without dark hero backgrounds need solid header immediately
  const isLightPage = location.pathname.includes('/products/') ||
    location.pathname.includes('/collections/') ||
    location.pathname.includes('/cart') ||
    location.pathname.includes('/account') ||
    location.pathname.includes('/search');

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 30);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link: string) => {
    setIsOpen(false);
    if (link.startsWith('#')) {
      if (location.pathname === '/') {
        const id = link.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 80;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 20;
          window.scrollTo({top: offsetPosition, behavior: 'smooth'});
        }
      } else {
        window.location.href = `/${link}`;
      }
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart();
  };

  return (
    <>
    <header
      className={`fixed left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'py-3'
          : 'py-5'
      }`}
      style={{
        top: 'var(--shipping-banner-height, 36px)',
        background: (isScrolled || isLightPage)
          ? 'rgba(250, 248, 243, 0.7)'
          : 'transparent',
        backdropFilter: (isScrolled || isLightPage) ? 'blur(16px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: (isScrolled || isLightPage) ? 'blur(16px) saturate(1.2)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Logo isScrolled={isScrolled || isLightPage} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-10">
            {config.navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className={`relative group transition-all duration-300 ${
                  (isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'
                }`}
                style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {item.name}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: (isScrolled || isLightPage) ? '#3d6b4f' : 'white',
                  }}
                ></span>
              </Link>
            ))}
          </div>

          {/* Account Button */}
          <a
            href="https://shopify.com/95831523661/account"
            className="ml-10 transition-all duration-300 hover:scale-105"
            aria-label="Mon compte"
          >
            <User
              className={`h-5 w-5 ${(isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'}`}
            />
          </a>

          {/* Cart Button */}
          <button
            onClick={handleCartClick}
            className="ml-4 relative transition-all duration-300 hover:scale-105"
            aria-label="Panier"
          >
            <ShoppingBag
              className={`h-5 w-5 ${(isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'}`}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-[10px] font-medium rounded-full h-[18px] w-[18px] flex items-center justify-center"
                style={{backgroundColor: '#3d6b4f'}}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="https://shopify.com/95831523661/account"
            className="p-2 transition-all duration-300"
            aria-label="Mon compte"
          >
            <User
              className={`h-5 w-5 ${(isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'}`}
            />
          </a>
          <button
            onClick={handleCartClick}
            className="relative p-2 transition-all duration-300"
            aria-label="Panier"
          >
            <ShoppingBag
              className={`h-5 w-5 ${(isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'}`}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[10px] font-medium rounded-full h-[18px] w-[18px] flex items-center justify-center"
                style={{backgroundColor: '#3d6b4f'}}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            className={`p-1.5 transition-all duration-300 ${(isScrolled || isLightPage) ? 'text-[#1a1a18]' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>

    {/* Mobile menu overlay - outside header for proper z-index */}
    {isOpen && (
      <div
        className="md:hidden fixed inset-0 z-[9998]"
        style={{background: 'rgba(0,0,0,0.4)'}}
        onClick={() => setIsOpen(false)}
      />
    )}

    {/* Mobile Menu - outside header for proper z-index */}
    <div
      className={`md:hidden fixed top-0 right-0 h-full transition-transform duration-700 z-[9999] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{
        width: '340px',
        maxWidth: '85vw',
        background: 'rgba(250, 248, 243, 0.98)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="p-8">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-[#1a1a18]"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <nav className="mt-16 flex flex-col">
          {config.navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => {
                if (item.href.startsWith('#')) {
                  e.preventDefault();
                  handleNavClick(item.href);
                } else {
                  setIsOpen(false);
                }
              }}
              className="text-[#1a1a18] py-4 border-b border-[#e8e4dc] transition-colors duration-300 hover:text-[#3d6b4f]"
              style={{
                fontSize: '13px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontWeight: 400,
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {socialLinks.length > 0 && (
          <div className="flex gap-6 mt-10">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.link as string}
                  className="text-[#7a7a75] hover:text-[#3d6b4f] transition-colors duration-300"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconComponent className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
