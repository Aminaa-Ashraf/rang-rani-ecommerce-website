export function formatPrice(price: number): string {
  return `Rs ${Math.round(price).toLocaleString('en-PK')}`
}
