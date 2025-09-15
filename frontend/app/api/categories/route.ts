import { NextResponse } from "next/server";

// Simple in-memory store for demo purposes.
// In production wire this to a database or backend API.
let CATEGORIES: string[] = [
	"Abrading & Polishing",
	"Building & Grounds",
	"Electrical & Lighting",
	"Fabricating",
	"Fastening & Joining",
	"Filtering",
	"Flow & Level Control",
	"Furniture & Storage",
	"Hand Tools",
	"Hardware",
	"Heating & Cooling",
	"Lubricating",
	"Material Handling",
	"Measuring & Inspecting",
	"Office Supplies & Signs",
];

export async function GET() {
	return NextResponse.json(CATEGORIES);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const name = (body.name || "").toString().trim();
		if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
		if (!CATEGORIES.includes(name)) CATEGORIES = [name, ...CATEGORIES];
		return NextResponse.json(CATEGORIES, { status: 201 });
	} catch (err) {
		return NextResponse.json({ error: "invalid" }, { status: 400 });
	}
}
