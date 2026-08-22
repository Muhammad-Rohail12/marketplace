const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.zafcart.com/api';

export const apiConfig = {
  baseUrl: configuredBaseUrl.replace(/\/+$/, '').endsWith('/api')
    ? configuredBaseUrl.replace(/\/+$/, '')
    : `${configuredBaseUrl.replace(/\/+$/, '')}/api`,
  timeoutMs: 15000,
};