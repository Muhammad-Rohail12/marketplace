const SITE_NAME = 'Marketplace';
const DEFAULT_DESCRIPTION = 'Shop millions of products across every category, with fast US shipping and trusted sellers.';

// Single source for building App Router metadata objects — every
// page-level metadata export below goes through this so title
// formatting/fallbacks stay consistent site-wide.
export function buildMetadata({ title, description, image, path, noIndex = false } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Shop the US Marketplace`;
  const desc = description?.slice(0, 160) || DEFAULT_DESCRIPTION;

  return {
    title: fullTitle,
    description: desc,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: desc,
    },
    ...(path ? { alternates: { canonical: path } } : {}),
  };
}