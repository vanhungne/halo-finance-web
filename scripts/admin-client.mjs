import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { generate } from "orval";
import config from "../orval.config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const target = path.join(root, "src/services/admin/generated/admin.ts");
const check = process.argv.includes("--check");
const candidate = path.join(path.dirname(target), ".admin-contract-check.ts");
const options = structuredClone(config);
options.admin.input = path.join(root, "contracts/admin.openapi.json");
options.admin.output.target = check ? candidate : target;
options.admin.output.override.mutator.path = path.join(root, "src/services/admin/adminTransport.ts");
await mkdir(path.dirname(target), { recursive: true });
const normalize = (value) => value.replace(/\r\n/g, "\n");
try {
  await generate(options.admin, root, { throwOnError: true, failOnWarnings: true });
  const generated = normalize(await readFile(check ? candidate : target, "utf8"));
  if (check) {
    const committed = normalize(await readFile(target, "utf8"));
    if (generated !== committed) throw new Error("Admin client drift: regenerate from the current backend contract.");
    console.log("Admin generated client matches its OpenAPI input.");
  } else await writeFile(target, generated, "utf8");
} finally {
  if (check) await unlink(candidate).catch((error) => { if (error.code !== "ENOENT") throw error; });
}
