import {useConfig} from '~/utils/themeContext';
import {Link} from 'react-router';

interface LogoProps {
  isScrolled?: boolean;
}

export function Logo({isScrolled = false}: LogoProps) {
  const config = useConfig();

  return (
    <div className="flex items-center transition-all duration-500">
      <Link to="/" className="flex items-center">
        <img
          src={config.brandLogo}
          alt={`${config.brandName} Logo`}
          className={`transition-all duration-500 ease-in-out ${
            isScrolled ? 'h-20 w-auto' : 'h-24 w-auto'
          }`}
          style={{
            filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
          }}
        />
      </Link>
    </div>
  );
}
