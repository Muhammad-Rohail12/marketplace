import './globals.css';
import AppProviders from '@/providers/AppProviders';
import { seoConfig } from '@/config/seo.config';

export const metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  openGraph: {
    siteName: seoConfig.openGraph.siteName,
    type: seoConfig.openGraph.type,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}