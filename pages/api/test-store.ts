import type { NextApiRequest, NextApiResponse } from 'next';
import { store } from '@/lib/raven';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = store.openSession();
    await session.store({
      playerId: 123,
      name: 'Aaron Judge',
      timestamp: new Date().toISOString(),
    });
    await session.saveChanges();

    res.status(200).json({ message: 'Saved player to RavenDB (classic route)' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ API Error:', message);
    res.status(500).json({ error: 'Failed to save', details: message });
  }
}
