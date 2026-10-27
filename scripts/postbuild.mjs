// Standalone build uchun static va public fayllarni nusxalash (Next.js talabi).
import { cpSync, existsSync } from "node:fs";
const s = ".next/standalone";
if (existsSync(s)) {
  cpSync(".next/static", `${s}/.next/static`, { recursive: true });
  cpSync("public", `${s}/public`, { recursive: true });
  console.log("✓ standalone: static + public copied");
}
