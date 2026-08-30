import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import type { CartItem, Customer, ShopOrder } from '../../shared/types.ts'
import { buildOrderEmail } from '../../shared/orderEmail.ts'
import { ProductApi } from '../api/client.ts'
import { STUDIO_EMAIL } from './contact.ts'
import { auth, db } from './firebase.ts'

export interface CheckoutDetails {
  name: string
  email: string
  phone: string
  city: string
  address: string
}

function toCustomer(uid: string, data: Record<string, unknown>): Customer {
  return {
    id: uid,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    city: String(data.city ?? ''),
    address: String(data.address ?? ''),
  }
}

function guestSecret(): string {
  return `rr.${crypto.randomUUID().replaceAll('-', '')}!A1`
}

function authCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code: string }).code)
  }
  return ''
}

export async function saveCustomerRecord(uid: string, details: CheckoutDetails): Promise<Customer> {
  const record = {
    name: details.name.trim(),
    email: details.email.trim().toLowerCase(),
    phone: details.phone.trim(),
    city: details.city.trim(),
    address: details.address.trim(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(doc(db, 'customers', uid), record, { merge: true })
  return {
    id: uid,
    name: record.name,
    email: record.email,
    phone: record.phone,
    city: record.city,
    address: record.address,
  }
}

export async function loadCustomer(uid: string): Promise<Customer | null> {
  const snap = await getDoc(doc(db, 'customers', uid))
  if (!snap.exists()) {
    return null
  }
  return toCustomer(uid, snap.data())
}

export async function signInShop(email: string, password: string): Promise<Customer> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password)
  const existing = await loadCustomer(result.user.uid)
  if (existing) {
    return existing
  }
  return {
    id: result.user.uid,
    name: result.user.displayName ?? '',
    email: result.user.email ?? email,
    phone: '',
    city: '',
    address: '',
  }
}

const api = new ProductApi()

export async function checkoutNewCustomer(
  details: CheckoutDetails,
  items: CartItem[],
  shopUrl = window.location.origin,
): Promise<void> {
  let user: User
  try {
    const result = await createUserWithEmailAndPassword(auth, details.email.trim(), guestSecret())
    await updateProfile(result.user, { displayName: details.name.trim() })
    user = result.user
  } catch (error) {
    if (authCode(error) !== 'auth/email-already-in-use') {
      throw error
    }
    const existing = auth.currentUser
    if (existing) {
      user = existing
    } else {
      user = (await signInAnonymously(auth)).user
    }
  }
  const customer = await saveCustomerRecord(user.uid, details)
  await writeOrder(user, customer, items, details.city, details.address, shopUrl)
}

export async function placeSignedInOrder(
  user: User,
  customer: Customer,
  city: string,
  address: string,
  items: CartItem[],
  shopUrl = window.location.origin,
): Promise<void> {
  const next = await saveCustomerRecord(user.uid, {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city,
    address,
  })
  await writeOrder(user, next, items, city, address, shopUrl)
}

async function writeOrder(
  user: User,
  customer: Customer,
  items: CartItem[],
  city: string,
  address: string,
  shopUrl: string,
): Promise<void> {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  await addDoc(collection(db, 'orders'), {
    uid: user.uid,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: city.trim(),
    address: address.trim(),
    items: items.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    total,
    createdAt: serverTimestamp(),
  })
  const viewUrl = `${shopUrl.replace(/\/$/, '')}/account`
  const notice = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: city.trim(),
    address: address.trim(),
    items: items.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    total,
    viewUrl,
  }
  const mail = buildOrderEmail(notice)
  await addDoc(collection(db, 'mail'), {
    uid: user.uid,
    to: customer.email,
    replyTo: STUDIO_EMAIL,
    message: {
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    },
  })
  try {
    await api.sendOrderEmail(notice)
  } catch (error) {
    console.error('Order email was saved in Firebase but the inbox send failed', error)
  }
}

export async function loadOrders(uid: string): Promise<ShopOrder[]> {
  const rows = await getDocs(query(collection(db, 'orders'), where('uid', '==', uid)))
  return rows.docs
    .map((row) => {
      const data = row.data()
      const created = data.createdAt?.toDate?.() as Date | undefined
      return {
        id: row.id,
        items: data.items,
        total: data.total,
        city: data.city,
        address: data.address,
        createdAt: created ? created.toISOString() : new Date().toISOString(),
      } as ShopOrder
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function watchAuth(onChange: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, onChange)
}

export async function signOutShop(): Promise<void> {
  await signOut(auth)
}
