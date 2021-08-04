export function zeroOrGreater(val: string): boolean {
  const numberVal = parseFloat(val);

  return numberVal === 0 || numberVal > 0;
}

export function greaterThanZero(val: string): boolean {
  const numberVal = parseFloat(val);

  return numberVal > 0;
}
