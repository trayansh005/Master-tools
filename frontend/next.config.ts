import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
	// Explicitly set Turbopack root to the frontend directory to avoid
	// Next.js inferring the workspace root when multiple lockfiles exist.
	// This silences the warning shown during `next build --turbopack`.
	turbopack: {
		root: path.resolve(__dirname),
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};

export default nextConfig;
