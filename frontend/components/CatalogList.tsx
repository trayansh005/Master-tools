import Link from "next/link";
import { slugify } from "../data/catalog";

export default function CatalogList({
	catalog,
}: {
	catalog: { title: string; items: string[] }[];
}) {
	return (
		<>
			{catalog.map((section) => (
				<section key={section.title} className="mb-10">
					<h2 className="text-lg font-semibold mb-4 border-b pb-3">{section.title}</h2>

					<div className="space-y-4">
						<div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-2">
							{section.items.map((item) => (
								<div
									key={item}
									className="w-36 shrink-0 flex flex-col items-center gap-2 text-center"
								>
									<Link href={`/product/${slugify(section.title)}`}>
										<div className="icon-box">
											<svg
												width="40"
												height="40"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect width="24" height="24" rx="3" fill="rgba(10,41,232,0.06)" />
												<path
													d="M6 12h12"
													stroke="var(--accent)"
													strokeWidth="1.2"
													strokeLinecap="round"
												/>
											</svg>
										</div>
									</Link>
									<div className="text-sm text-gray-700">{item}</div>
								</div>
							))}
						</div>
					</div>
				</section>
			))}
		</>
	);
}
