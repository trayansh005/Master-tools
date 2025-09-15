import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve("./backend/data/categories.json");

function readCategories() {
	try {
		const raw = fs.readFileSync(DATA_PATH, "utf-8");
		return JSON.parse(raw);
	} catch (err) {
		return [];
	}
}

function writeCategories(categories) {
	try {
		fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
		fs.writeFileSync(DATA_PATH, JSON.stringify(categories, null, 2), "utf-8");
	} catch (err) {
		console.error("Failed to write categories", err);
	}
}

const controller = {
	list(req, res) {
		const categories = readCategories();
		res.json(categories);
	},
	create(req, res) {
		const name = (req.body?.name || "").toString().trim();
		if (!name) return res.status(400).json({ error: "name required" });
		const categories = readCategories();
		if (!categories.includes(name)) {
			categories.unshift(name);
			writeCategories(categories);
		}
		res.status(201).json(categories);
	},
};

export default controller;
