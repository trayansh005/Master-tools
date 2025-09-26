import HomeClient from "../components/HomeClient";
import ReactQueryProvider from "../components/ReactQueryProvider";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { fetchCategoriesServer } from "../apiServices/categories.server";
import { fetchProductsServer } from "../apiServices/products.server";

// Server component: prefetch categories and products and pass dehydrated state to client
export default async function Page() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // 5 minutes
				refetchOnWindowFocus: false,
			},
		},
	});

	try {
		await queryClient.prefetchQuery({ queryKey: ["categories"], queryFn: fetchCategoriesServer });
		await queryClient.prefetchQuery({
			queryKey: ["products", undefined, ""],
			queryFn: () => fetchProductsServer(),
		});
	} catch (error) {
		console.error("Error prefetching data:", error);
		// Continue anyway - the client will fetch the data
	}

	const dehydrated = dehydrate(queryClient);

	return (
		// Wrap client components in Suspense to avoid CSR bailout errors for next/navigation hooks
		<Suspense fallback={<div></div>}>
			<ReactQueryProvider dehydratedState={dehydrated}>
				{/* HomeClient is a client component that will use useQuery to read categories */}
				<HomeClient />
			</ReactQueryProvider>
		</Suspense>
	);
}
