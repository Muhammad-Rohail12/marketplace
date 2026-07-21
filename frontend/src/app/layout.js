import './globals.css';

export const metadata = {
  title: 'Marketplace',
  description: 'A professional multi-vendor e-commerce marketplace',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}