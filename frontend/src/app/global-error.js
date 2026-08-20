'use client';

// Catches errors in the ROOT layout itself (rare, but required for a
// complete error-boundary story) — must render its own <html>/<body>
// since the root layout is what failed.
export default function GlobalError({ reset }) {
  return (
    <html lang="en-US">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: '#666', maxWidth: '24rem' }}>The application failed to load. Please try again.</p>
          <button
            onClick={reset}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.375rem', background: '#2249e0', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}