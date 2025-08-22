import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import DocumentStore from 'ravendb';
import { Stats_By_Team } from './indices.raven.ts';

dotenv.config({ path: '.env' });

const certPath = path.resolve(process.cwd(), 'src/app/cert', process.env.RAVEN_CERT!);
console.log("🔒 Using cert in API route:", certPath);

const store = new DocumentStore(
  process.env.RAVEN_URL!,
  process.env.RAVEN_DB!,
  {
      certificate: fs.readFileSync(certPath),
      type: "pfx",
      password: process.env.RAVEN_CERT_PASSWORD!,
    }
);

store.initialize();

export const createIndices = async (store: DocumentStore) => {
  console.log('Creating indices...');
  const accumulatedStatsIndex = new Stats_By_Team();
  await accumulatedStatsIndex.execute(store)
  console.log('Indices successfully created!');
}

export { store };