import {useConfig} from '~/utils/themeContext';

export function FooterLogo() {
  const config = useConfig();

  return (
    <div className="flex items-center justify-center">
      <img
        src="/images/logo/hoso-logo-white.png"
        alt={`${config.brandName} Logo`}
        className="h-14 w-auto"
      />
    </div>
  );
}
