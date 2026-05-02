import ReduxProvider from '@/provider/ReduxProvider';
import { Toaster } from 'react-hot-toast';
import { AnalyticsTracker } from '@/components/shared/AnalyticsTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <AnalyticsTracker />
      <Toaster position="top-right" />
    </ReduxProvider>
  );
}
