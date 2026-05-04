import ReduxProvider from '@/provider/ReduxProvider';
import { Toaster } from 'react-hot-toast';
import { AnalyticsTracker } from '@/components/shared/AnalyticsTracker';
import AuthProvider from '../AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
      {children}
      <AnalyticsTracker />
      <Toaster position="top-right" />
      </AuthProvider>
    </ReduxProvider>
  );
}
