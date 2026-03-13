import {useConfig} from '~/utils/themeContext';
import {Link} from 'react-router';

interface LogoProps {
  isScrolled?: boolean;
}

export function Logo({isScrolled = false}: LogoProps) {
  const config = useConfig();

  return (
    <div className="flex items-center transition-all duration-500">
      <Link to="/" className="flex items-center overflow-hidden" style={{
        height: isScrolled ? '50px' : '60px',
        width: isScrolled ? '100px' : '120px',
        transition: 'all 0.5s ease',
      }}>
        <img
          src={config.brandLogo}
          alt={`${config.brandName} Logo`}
          className="w-full h-full transition-all duration-500 ease-in-out"
          style={{
            filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
            objectFit: 'cover',
            transform: 'scale(1.8)',
          }}
        />
      </Link>
    </div>
  );
}
