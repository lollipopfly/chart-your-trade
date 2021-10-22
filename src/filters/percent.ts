export default function percent(value: number): string {
  if (!value) return "0%";

  const valStr = value.toString();

  return `${valStr}%`;
}
