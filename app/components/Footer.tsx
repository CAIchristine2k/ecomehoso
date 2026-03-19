import React from 'react';
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music,
} from 'lucide-react';
import {Link} from 'react-router';
import {FooterLogo} from './FooterLogo';
import {useConfig} from '~/utils/themeContext';

export function Footer() {
  const config = useConfig();

  const socialLinks = Object.entries(config.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      icon: getSocialIcon(platform),
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      url,
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

  const shopLinks = [
    {name: 'Tous les produits', href: '/collections/all'},
    {name: 'Nos Matchas', href: '/collections/all'},
    {name: 'Accessoires', href: '/collections/all'},
    {name: 'Coffrets', href: '/collections/all'},
  ];

  const infoLinks = [
    {name: 'Notre Histoire', href: '/notre-histoire'},
    {name: 'Contact', href: 'mailto:hosomatchagroup@gmail.com'},
  ];

  const policies = [
    {name: 'Mentions légales', href: '/policies/privacy-terms'},
    {name: 'Plan du site', href: '/sitemap.xml'},
  ];

  return (
    <footer
      className="px-6 md:px-10 pt-12 md:pt-16 pb-8 md:pb-10 flex-shrink-0 mt-auto"
      style={{
        backgroundColor: '#1a2f23',
        color: 'white',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 pb-10 md:pb-12"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Brand Column */}
          <div className="max-w-[280px] text-center sm:text-left mx-auto sm:mx-0">
            <Link to="/">
              <FooterLogo />
            </Link>
            <p
              className="mt-6"
              style={{
                fontSize: '13px',
                fontWeight: 300,
                opacity: 0.5,
                lineHeight: 1.9,
              }}
            >
              Matcha d'exception sélectionné à Uji, Kyoto. L'art du thé vert japonais, de la feuille à la tasse.
            </p>

            {socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6 justify-center sm:justify-start">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity duration-300 hover:opacity-100"
                      style={{opacity: 0.5}}
                      aria-label={social.label}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Boutique Column */}
          <div className="text-center sm:text-left">
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: '#5a8a6a',
                marginBottom: '24px',
              }}
            >
              Boutique
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="transition-opacity duration-300 hover:opacity-100"
                    style={{
                      fontSize: '13px',
                      fontWeight: 300,
                      opacity: 0.5,
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations Column */}
          <div className="text-center sm:text-left">
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: '#5a8a6a',
                marginBottom: '24px',
              }}
            >
              Informations
            </h4>
            <ul className="space-y-3">
              {infoLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="transition-opacity duration-300 hover:opacity-100"
                    style={{
                      fontSize: '13px',
                      fontWeight: 300,
                      opacity: 0.5,
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center sm:text-left">
            <h4
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: '#5a8a6a',
                marginBottom: '24px',
              }}
            >
              Contact
            </h4>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 300,
                opacity: 0.5,
                lineHeight: 1.9,
              }}
            >
              {config.contactInfo?.email && <p>{config.contactInfo.email}</p>}
              {config.contactInfo?.address && <p>{config.contactInfo.address}</p>}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p style={{fontSize: '11px', opacity: 0.3}}>
            &copy; {new Date().getFullYear()} {config.brandName}. Tous droits réservés.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {policies.map((policy, index) => (
              <Link
                key={index}
                to={policy.href}
                className="transition-opacity duration-300 hover:opacity-50"
                style={{fontSize: '11px', opacity: 0.3}}
              >
                {policy.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
