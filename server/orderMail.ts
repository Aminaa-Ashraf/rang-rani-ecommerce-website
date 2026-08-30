import nodemailer from 'nodemailer'
import { buildOrderEmail, type OrderEmailInput } from '../shared/orderEmail.ts'

const STUDIO_EMAIL = 'rangrani.studio@gmail.com'

function smtpReady(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

async function sendWithSmtp(input: OrderEmailInput, mail: { subject: string; text: string; html: string }): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Rang Rani" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: input.email,
    bcc: STUDIO_EMAIL,
    replyTo: STUDIO_EMAIL,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  })
}

async function sendWithFormSubmit(input: OrderEmailInput, mail: { subject: string; text: string }): Promise<void> {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(STUDIO_EMAIL)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      _subject: mail.subject,
      _template: 'box',
      _captcha: 'false',
      _autoresponse: mail.text,
      message: mail.text,
    }),
  })

  if (!response.ok) {
    throw new Error(`FormSubmit failed (${response.status})`)
  }
}

export async function sendOrderNotice(input: OrderEmailInput): Promise<{ sent: boolean; via: string }> {
  const mail = buildOrderEmail(input)

  if (smtpReady()) {
    await sendWithSmtp(input, mail)
    return { sent: true, via: 'smtp' }
  }

  await sendWithFormSubmit(input, mail)
  return { sent: true, via: 'formsubmit' }
}
