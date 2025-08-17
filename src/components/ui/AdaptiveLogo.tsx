import { RootState } from '@/store';
import Image from 'next/image';

import { useSelector } from 'react-redux';

export default function AdaptiveLogo() {
  // Dark Mode
  const theme = useSelector((state: RootState) => state.app.theme);

  const isThemeDark = () => {
    if (theme == 'light') {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {
        //Conditional logo based on theme
      }
      {isThemeDark() ? (
        <Image
          src={'/assets/images/maliccwhite.png'}
          priority={true}
          alt="malicc.store"
          width={100}
          height={100}
        />
      ) : (
        <Image
          src={'/assets/images/malicc.svg'}
          alt="malicc.store"
          width={100}
          height={100}
        />
      )}
    </>
  );
}
