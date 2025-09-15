import Vibrant from "node-vibrant";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.resolve(__dirname, "../public/logo.png");

try {
	const palette = await Vibrant.from(logoPath).getPalette();
	const entries = Object.entries(palette).filter(([, sw]) => sw);
	const out = entries.map(([name, sw]) => ({
		name,
		hex: sw.hex,
		rgb: sw.rgb,
		population: sw.population,
	}));
	const cssVars = entries
		.map(([name, sw]) => `  --brand-${name.toLowerCase()}: ${sw.hex};`)
		.join("\n");

	const css = `:root {\n${cssVars}\n}\n`;

	const outDir = path.resolve(__dirname, "../.brand");
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, "palette.json"), JSON.stringify(out, null, 2));
	fs.writeFileSync(path.join(outDir, "palette.css"), css);
	console.log("Extracted palette to .brand/palette.json and .brand/palette.css");
	console.table(out);
} catch (e) {
	console.error("Failed to extract palette:", e);
	process.exit(1);
}
