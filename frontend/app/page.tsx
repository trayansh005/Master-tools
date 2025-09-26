"use client";

import HomeClient from "../components/HomeClient";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<HomeClient />
		</Suspense>
	);
}
