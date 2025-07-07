import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentStore, IAuthOptions } from 'ravendb';

dotenv.config({ path: '.env' }); // 👈 Add this if not renamed yet

const certPath = path.resolve(process.cwd(), 'src/app/cert', process.env.RAVEN_CERT!);
console.log("🔒 Using cert in API route:", certPath);

const authSettings: IAuthOptions = {
  certificate: fs.readFileSync(certPath),
  type: 'pfx',
  password: process.env.RAVEN_CERT_PASSWORD,
};

const store = new DocumentStore(
  process.env.RAVEN_URL!,
  process.env.RAVEN_DB!,
  authSettings
);

store.initialize();

export { store };