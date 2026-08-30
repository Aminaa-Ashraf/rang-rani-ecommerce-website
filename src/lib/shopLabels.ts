import { ProductCategory, type Product } from '../../shared/types'

export const shopCategoryLabel: Record<ProductCategory, string> = {
  [ProductCategory.Beaded]: 'Beaded Bracelets',
  [ProductCategory.Kundan]: 'Kundan Bangles',
  [ProductCategory.Charm]: 'Charm Bracelets',
  [ProductCategory.Bridal]: 'Bridal Bangles',
  [ProductCategory.Friendship]: 'Friendship',
  [ProductCategory.GoldPlated]: 'Gold plated',
}

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('braclets', 'bracelets')
    .replaceAll('braclet', 'bracelet')
    .replaceAll('bangels', 'bangles')
    .replaceAll('bangel', 'bangle')
    .replaceAll('velevet', 'velvet')
    .replaceAll('velvat', 'velvet')
    .replaceAll('velvte', 'velvet')
}

const skipWords = new Set(['or', 'and', 'the', 'a', 'an', 'of', 'for'])

function editDistance(left: string, right: string): number {
  if (left === right) {
    return 0
  }
  if (left.length === 0) {
    return right.length
  }
  if (right.length === 0) {
    return left.length
  }

  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= right.length; j += 1) {
      const current = row[j]
      const cost = left[i - 1] === right[j - 1] ? 0 : 1
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + cost)
      previous = current
    }
  }
  return row[right.length]
}

function allowedTypos(word: string): number {
  if (word.length >= 6) {
    return 2
  }
  if (word.length >= 4) {
    return 1
  }
  return 0
}

function wordMatchesHay(word: string, haystack: string, hayWords: string[]): boolean {
  if (haystack.includes(word)) {
    return true
  }

  const typos = allowedTypos(word)
  if (typos === 0) {
    return false
  }

  return hayWords.some((hayWord) => {
    if (hayWord.includes(word) || (word.length >= 4 && word.includes(hayWord))) {
      return true
    }
    return editDistance(word, hayWord) <= typos
  })
}

export const shopCollections = [
  ProductCategory.Beaded,
  ProductCategory.Kundan,
  ProductCategory.Charm,
  ProductCategory.Bridal,
] as const

export function textMatchesSearch(text: string, query: string): boolean {
  const words = normalizeSearch(query)
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !skipWords.has(word))
  if (words.length === 0) {
    return true
  }

  const haystack = normalizeSearch(text)
  const hayWords = haystack.split(/\s+/).filter((word) => word.length >= 2)
  return words.every((word) => wordMatchesHay(word, haystack, hayWords))
}

export function productMatchesSearch(product: Product, query: string): boolean {
  return textMatchesSearch(
    [product.title, product.description, product.category, shopCategoryLabel[product.category] ?? ''].join(' '),
    query,
  )
}
