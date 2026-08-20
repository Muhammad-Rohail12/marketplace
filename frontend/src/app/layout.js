import './globals.css';
import AppProviders from '@/providers/AppProviders';
import { buildMetadata } from '@/utils/seo';

export const metadata = buildMetadata({});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-US">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}