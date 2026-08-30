import type { OrderItem } from './types'

export interface OrderEmailInput {
  name: string
  email: string
  phone: string
  city: string
  address: string
  items: OrderItem[]
  total: number
  viewUrl: string
}

function rupees(price: number): string {
  return `Rs ${Math.round(price).toLocaleString('en-PK')}`
}

export function buildOrderEmail(input: OrderEmailInput): { subject: string; text: string; html: string } {
  const lines = input.items.map(
    (item) => `${item.title} x ${item.quantity} — ${rupees(item.price * item.quantity)}`,
  )
  const subject = `Thank you for your Rang Rani order (${rupees(input.total)})`
  const text = [
    `Hi ${input.name},`,
    '',
    'Thank you for your order. The Lahore studio has it.',
    '',
    ...lines,
    '',
    `Total: ${rupees(input.total)}`,
    `Ship to: ${input.address}, ${input.city}`,
    '',
    `View your order: ${input.viewUrl}`,
    '',
    'Rang Rani',
  ].join('\n')

  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #efe6d6;font-family:Georgia,serif;color:#1c1014;">
            ${item.title}<br />
            <span style="color:#6d5c52;font-size:13px;">Qty ${item.quantity} · ${rupees(item.price)} each</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #efe6d6;text-align:right;font-family:Georgia,serif;color:#d4af37;">
            ${rupees(item.price * item.quantity)}
          </td>
        </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html>
<body style="margin:0;background:#f9f7f2;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px 24px;font-family:Georgia,serif;color:#1c1014;">
    <p style="margin:0 0 6px;letter-spacing:0.14em;text-transform:uppercase;font-size:11px;color:#d4af37;">Rang Rani</p>
    <h1 style="margin:0 0 12px;font-size:28px;">Thank you for your order</h1>
    <p style="margin:0 0 20px;color:#6d5c52;font-family:Arial,sans-serif;line-height:1.6;">
      Hi ${input.name}, your jewelry order is with the Lahore studio.
    </p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <p style="margin:18px 0 8px;font-size:20px;">Total <strong style="color:#d4af37;">${rupees(input.total)}</strong></p>
    <p style="margin:0 0 22px;color:#6d5c52;font-family:Arial,sans-serif;font-size:14px;">
      Ship to ${input.address}, ${input.city}
    </p>
    <a href="${input.viewUrl}" style="display:inline-block;background:#1c1014;color:#fffdf8;text-decoration:none;padding:12px 20px;border-radius:12px;font-family:Arial,sans-serif;">
      View your order
    </a>
    <p style="margin:24px 0 0;color:#6d5c52;font-family:Arial,sans-serif;font-size:13px;">
      We will write back from Lahore to confirm packing.
    </p>
  </div>
</body>
</html>`

  return { subject, text, html }
}
