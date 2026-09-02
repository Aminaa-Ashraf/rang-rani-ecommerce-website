const STORAGE_KEY = 'rangrani-admin-token'

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(STORAGE_KEY)
}

export function setAdminToken(token: string): void {
  window.sessionStorage.setItem(STORAGE_KEY, token)
}

export function clearAdminToken(): void {
  window.sessionStorage.removeItem(STORAGE_KEY)
}
