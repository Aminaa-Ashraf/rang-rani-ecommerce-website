import { useState, type FormEvent } from 'react'
import { isProductCategory, ProductCategory } from '../../shared/types'
import type { CreateProductInput, Product } from '../../shared/types'

interface ProductFormProps {
  categories: ProductCategory[]
  product: Product | null
  saving: boolean
  onClose: () => void
  onSubmit: (input: CreateProductInput) => Promise<void>
}

export function ProductForm({ categories, product, saving, onClose, onSubmit }: ProductFormProps) {
  const [title, setTitle] = useState(product?.title ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? categories[0] ?? ProductCategory.Beaded,
  )
  const [image, setImage] = useState(product?.image ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [stock, setStock] = useState(product ? String(product.stock) : '8')

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!isProductCategory(category)) {
      window.alert('Choose a valid category')
      return
    }

    const nextStock = Number(stock)
    if (!Number.isInteger(nextStock) || nextStock < 0) {
      window.alert('Stock must be a whole number of 0 or more')
      return
    }

    await onSubmit({
      title: title.trim(),
      price: Number(price),
      category,
      image: image.trim(),
      description: description.trim(),
      stock: nextStock,
    })
  }

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <form className="panel form" onClick={(event) => event.stopPropagation()} onSubmit={(event) => void handleSubmit(event)}>
        <button className="btn ghost" type="button" onClick={onClose}>
          Close
        </button>
        <h2 className="has-rule">{product ? 'Edit jewelry' : 'Add jewelry'}</h2>
        <p className="muted">Saves to Atlas. Paste any bracelet photo URL.</p>
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={80} />
        </label>
        <label>
          Stock (pieces on hand)
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
          />
        </label>
        <label>
          Price (Rs)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => {
              if (isProductCategory(event.target.value)) {
                setCategory(event.target.value)
              }
            }}
            required
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            required
            placeholder="https://"
          />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={240} />
        </label>
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save to Rang Rani'}
        </button>
      </form>
    </div>
  )
}
