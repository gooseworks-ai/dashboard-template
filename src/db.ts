// Helper re-export so server code can import the Turso client from one place.
// Only used server-side (from server.js). The browser should never touch this.
export { createClient } from "@libsql/client";
