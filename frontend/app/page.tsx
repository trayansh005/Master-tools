import HomeClient from "../components/HomeClient";
import ReactQueryProvider from "../components/ReactQueryProvider";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { fetchCategoriesServer } from "../apiServices/categories.server";

// Server component: prefetch categories and pass dehydrated state to client
export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({ queryKey: ["categories"], queryFn: fetchCategoriesServer });

	const dehydrated = dehydrate(queryClient);

	return (
		// Wrap client components in Suspense to avoid CSR bailout errors for next/navigation hooks
		<Suspense fallback={<div>Loading...</div>}>
			<ReactQueryProvider dehydratedState={dehydrated}>
				{/* HomeClient is a client component that will use useQuery to read categories */}
				<HomeClient />
			</ReactQueryProvider>
		</Suspense>
	);
}
