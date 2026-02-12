import ReduxProvider from '@/provider/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster position="top-right" />
    </ReduxProvider>
  );
}
