import { createIndices, store } from "../src/lib/raven.ts";

(async () => {
  await createIndices(store);
  process.exit(0);
})();