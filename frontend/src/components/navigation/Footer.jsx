export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-surface-dark">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
        <nav aria-label="Footer navigation" className="flex gap-4">
          <span>About</span>
          <span>Contact</span>
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
      </div>
    </footer>
  );
}
