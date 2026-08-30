import type { NextApiRequest, NextApiResponse } from 'next'
import { getApi } from '../../../server/getApi'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const app = await getApi()
    app(req, res)
  } catch {
    res.status(503).json({ error: 'Catalog is waking up. Allow Atlas access from anywhere, then refresh.' })
  }
}
