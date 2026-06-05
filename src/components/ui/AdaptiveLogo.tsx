import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface AdaptiveLogoProps {
  previewWidth?: number;
  previewUrl?: string;
}

export default function AdaptiveLogo({
  previewWidth,
  previewUrl,
}: AdaptiveLogoProps = {}) {
  const theme = useSelector((state: RootState) => state.app.theme);
  const appearance = useSelector(
    (state: RootState) => state.adminAppearance?.settings
  );

  const isThemeDark = () => {
    return theme !== 'light';
  };

  const defaultLogo = isThemeDark()
    ? '/assets/images/maliccwhite.png'
    : '/assets/images/malicc.svg';

  const logoUrl = previewUrl || appearance?.logo_url || defaultLogo;
  const logoWidth = previewWidth || appearance?.logo_width || 100;

  return (
    <img
      src={logoUrl}
      alt={appearance?.store_name || 'malicc.store'}
      width={logoWidth}
      height={logoWidth}
      style={{ objectFit: 'contain' }}
    />
  );
}

// import { RootState } from '@/store';
// import Image from 'next/image';

// import { useSelector } from 'react-redux';

// interface AdaptiveLogoProps {
//   previewWidth?: number;
//   previewUrl?: string;
// }

// export default function AdaptiveLogo({ previewWidth, previewUrl }: AdaptiveLogoProps = {}) {
//   // Dark Mode
//   const theme = useSelector((state: RootState) => state.app.theme);
//   const appearance = useSelector((state: RootState) => state.adminAppearance?.settings);

//   const isThemeDark = () => {
//     if (theme == 'light') {
//       return false;
//     } else {
//       return true;
//     }
//   };

//   const defaultLogo = isThemeDark() ? '/assets/images/maliccwhite.png' : '/assets/images/malicc.svg';
//   const logoUrl = previewUrl || appearance?.logo_url || defaultLogo;
//   const logoWidth = previewWidth || appearance?.logo_width || 100;

//   return (
//     <>
//       <Image
//         src={logoUrl}
//         priority={true}
//         alt={appearance?.store_name || "malicc.store"}
//         width={logoWidth}
//         height={logoWidth}
//         style={{ objectFit: 'contain' }}
//       />
//     </>
//   );
// }
