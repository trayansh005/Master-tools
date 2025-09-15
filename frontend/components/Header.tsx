import Image from "next/image";

export default function Header() {
	return (
		<header className="border-b border-gray-200">
			<div className=" mx-auto px-2 py-4 flex items-center gap-6">
				<div className="flex items-center gap-3">
					<Image src="/logo.png" alt="Logo" width={180} height={40} />
				</div>

				<div className="flex-1">
					<div className="max-w-xl mx-auto">
						<input
							className="search-input w-full border border-gray-300 rounded px-3 py-2 shadow-sm placeholder:text-sm"
							placeholder="Search"
							aria-label="search"
						/>
					</div>
				</div>

				<div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
					<div>Order</div>
					<div>Order History</div>
					<div className="text-xs text-gray-400">(630) 833-0300</div>
				</div>
			</div>
		</header>
	);
}
