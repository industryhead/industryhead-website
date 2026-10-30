// Vercel serverless entry: vercel.json rewrites /api/* here, and the Express app handles the original path.
import { createApp, adminTokenFromEnv } from "../server/src/app.js";
import { storeFromEnv } from "../server/src/store.js";

const app = createApp({ store: await storeFromEnv(), adminToken: adminTokenFromEnv(), trustProxy: true, notifyUrl: process.env.ENQUIRY_WEBHOOK_URL });
export default app;
