const STORAGE_KEY = 'rangrani-admin-key'

export function getAdminKey(): string | null {
  return window.sessionStorage.getItem(STORAGE_KEY)
}

export function setAdminKey(key: string): void {
  window.sessionStorage.setItem(STORAGE_KEY, key)
}

export function clearAdminKey(): void {
  window.sessionStorage.removeItem(STORAGE_KEY)
}
