export function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value = '') {
  return /^\+?[0-9]{7,15}$/.test(value);
}

export function isStrongPassword(value = '') {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
}

export function isValidUrl(value = '') {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidImageFile(file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
  return !!file && allowedTypes.includes(file.type);
}

export function isNotEmpty(value = '') {
  return value.trim().length > 0;
}

export function minLength(value = '', length = 0) {
  return value.trim().length >= length;
}