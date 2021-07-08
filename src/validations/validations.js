export function zeroOrGreater(value) {
  value = parseFloat(value);

  return value === 0 || value > 0;
}

export function greaterThanZero(value) {
  value = parseFloat(value);

  return value > 0;
}
