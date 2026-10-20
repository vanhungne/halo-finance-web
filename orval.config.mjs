import { defineConfig } from "orval";

export default defineConfig({
  admin: {
    input: "./contracts/admin.openapi.json",
    output: {
      target: "./src/services/admin/generated/admin.ts",
      mode: "single",
      client: "axios-functions",
      override: {
        // Keep Swagger's alternative schema during Orval deduplication; the
        // shared transport converts its formatter wildcard to concrete JSON.
        contentType: { include: ["application/json", "application/*+json"] },
        mutator: { path: "./src/services/admin/adminTransport.ts", name: "adminTransport" },
      },
    },
  },
});
