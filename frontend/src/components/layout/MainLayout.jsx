import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import MobileBottomNav from '@/components/navigation/MobileBottomNav';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}