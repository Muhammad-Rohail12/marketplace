import Sidebar from '../navigation/Sidebar';

export default function DashboardLayout({ children, sidebarLinks = [], sidebarTitle }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar links={sidebarLinks} title={sidebarTitle} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
