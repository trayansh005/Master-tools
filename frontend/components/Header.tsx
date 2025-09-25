"use client";
import Image from "next/image";
import Link from "next/link";
import { CgFormatJustify } from "react-icons/cg";
import { useState } from "react";
import CartDisplay from "@/components/Cartdisplay";
import { useCart } from "@/contexts/CartContext";

export default function Header({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (val: string) => void }) {
  const [showCart, setShowCart] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="border-b border-gray-200 relative">
      <div className="mx-auto px-2 py-1 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-600 green-text text-bold">
          <span><CgFormatJustify /></span>
          <Link href="/" className="text-brand-green font-bold ml-1">BROWSE CATALOG</Link>
        </div>
        <div className="text-sm text-gray-600 gap-5 flex items-center">
          <span className="text-sm text-brand-green">(630) 833-0300</span>
          <span>|</span>
          <span className="text-sm text-brand-green">Email Us </span>
          <span>|</span>
          <span className="text-sm text-brand-green mr-4">Log in </span>
        </div>
      </div>

      <div className="mx-auto px-2 pb-1 flex items-center gap-6 relative">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={250} height={40} />
          </Link>
        </div>

        <div className="flex-1">
          <div className="max-w-xl mx-auto">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full border border-gray-300 rounded px-3 py-2 shadow-sm placeholder:text-sm"
              placeholder="Search products or categories"
              aria-label="search"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 mr-4">
			<Link
				href="/orders"
				className="green-text text-brand-green relative"
				style={{ fontWeight: 1000, fontSize: 18 }}
				>
				Order
				{totalItems > 0 && (
					<span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
					{totalItems}
					</span>
				)}
			</Link>

      <Link
				href="/orders-history"
				className="green-text text-brand-green relative"
				style={{ fontWeight: 1000, fontSize: 18 }}
				>
				Order History
			</Link>
        </div>

        {/* Cart Display Popup */}
        {showCart && <CartDisplay />}
      </div>

      <hr className="h-0.5 bg-yellow-500 border-0" />
    </header>
  );
}
