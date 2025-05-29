export function formatToTwoDecimalPlaces(value: number) {
  return value.toFixed(2);
}

export function formatToCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}