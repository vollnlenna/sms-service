export function formatPhoneTail(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 10);

  const g1 = d.slice(0, 3);
  const g2 = d.slice(3, 6);
  const g3 = d.slice(6, 8);
  const g4 = d.slice(8, 10);

  const parts: string[] = [];
  if (g1) {
    parts.push(g1);
  }
  if (g2) {
    parts.push(g2);
  }
  if (g3) {
    parts.push(g3);
  }
  if (g4) {
    parts.push(g4);
  }

  return parts.join(' ');
}

export function normalizeTailToE164(tailDigits: string): string | null {
  const digits = tailDigits.replace(/\D/g, '').slice(0, 10);
  if (digits.length !== 10) {
    return null;
  }
  return `+7${digits}`;
}
