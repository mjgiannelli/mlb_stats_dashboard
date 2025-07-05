import { DocumentStore, IAuthOptions } from "ravendb";
import * as fs from 'fs';

const authSettings: IAuthOptions = {
      certificate: fs.readFileSync(`src/app/cert/${process.env.RAVEN_CERT}`),
      type: 'pfx',
      password: process.env.RAVEN_CERT_PASSWORD,
    };

const store = new DocumentStore(
    process.env.RAVEN_URL as string,
    process.env.RAVEN_DB as string,
    authSettings,
);
store.initialize();

export { store };