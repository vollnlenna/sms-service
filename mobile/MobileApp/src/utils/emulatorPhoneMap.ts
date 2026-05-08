const DEV_PHONE_MAP: Record<string, string> = {
  '+79999999999': '+15555215554', // эмулятор 1
  '+78888888888': '+15555215556', // эмулятор 2
};

const DEV_PHONE_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(DEV_PHONE_MAP).map(([virtual, real]) => [real, virtual]),
);

export function resolveRealPhone(phone: string): string {
  if (__DEV__) {
    return DEV_PHONE_MAP[phone] ?? phone;
  }
  return phone;
}

export function isKnownEmulatorPhone(realPhone: string): boolean {
  if (__DEV__) {
    return realPhone in DEV_PHONE_MAP_REVERSE;
  }
  return true;
}
