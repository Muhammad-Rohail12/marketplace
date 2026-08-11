import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only-focusable">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
