export function formatToTwoDecimalPlaces(value: number) {
  return value.toFixed(2);
}

export function formatToCurrency(value: number | string): string {
  const numberValue = typeof value === 'string' ? Number(value) : value;
  if (isNaN(numberValue)) {
    console.warn("Valor inválido para formatação:", value);
    return value.toString(); // fallback
  }

  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}