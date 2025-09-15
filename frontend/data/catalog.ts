export const CATALOG = [
	{
		title: "Fastening & Joining",
		items: [
			"Screws & Bolts",
			"Threaded Rods & Studs",
			"Eyebolts",
			"U-Bolts",
			"Nuts",
			"Washers",
			"Shims",
			"Pins",
			"Anchors",
			"Nails",
		],
	},
	{
		title: "Pipe, Tubing, Hose & Fittings",
		items: [
			"Pipe Fittings & Pipe",
			"Pipe Hangers",
			"Pipe Joints",
			"Pipe & Tube Repair Clamps",
			"Tubing",
			"Tube Fittings",
		],
	},
	{
		title: "Power Transmission",
		items: ["Bearings", "Bushings", "Motors", "Shafts", "Pulleys", "Chains", "Sprockets"],
	},
];

export function slugify(title: string) {
	return encodeURIComponent(
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "")
	);
}

export function findBySlug(slug: string) {
	return CATALOG.find((s) => slugify(s.title) === slug) || null;
}
