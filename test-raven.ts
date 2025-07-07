import { DocumentStore } from "ravendb";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const certPath = path.resolve(process.cwd(), "src/app/cert", process.env.RAVEN_CERT!);

console.log("🔒 Using cert:", certPath);

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

async function run() {
  try {
    const session = store.openSession();
    await session.store({
      test: true,
      message: "Standalone connection test",
      timestamp: new Date().toISOString(),
    });
    await session.saveChanges();
    console.log("✅ SUCCESS: Saved test doc to RavenDB!");
  } catch (err) {
    console.error("❌ ERROR during RavenDB test:", err);
  }
}

run();
