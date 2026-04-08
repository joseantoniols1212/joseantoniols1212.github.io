import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Start astro preview and detect the actual port from stdout
const server = spawn("npx", ["astro", "preview", "--port", "4322"], {
  cwd: root,
  stdio: ["ignore", "pipe", "inherit"],
});

const port = await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    const match = chunk.toString().match(/localhost:(\d+)/);
    if (match) resolve(Number(match[1]));
  });
});

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

await page.goto(`http://localhost:${port}/cv`, { waitUntil: "networkidle0" });

await page.pdf({
  path: path.join(root, "public", "cv.pdf"),
  format: "A4",
  margin: { top: "1.5cm", bottom: "1.5cm", left: "1.8cm", right: "1.8cm" },
  printBackground: true,
});

console.log("✓ CV generated → public/cv.pdf");

await browser.close();
server.kill();
process.exit(0);
