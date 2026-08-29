import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBXAFtTVj3fmg-2UCo8VKioI4m5hR4GKa4',
  authDomain: 'rangrani-shop.firebaseapp.com',
  projectId: 'rangrani-shop',
  storageBucket: 'rangrani-shop.firebasestorage.app',
  messagingSenderId: '157516053889',
  appId: '1:157516053889:web:b10c6b9512b2958134fc80',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
