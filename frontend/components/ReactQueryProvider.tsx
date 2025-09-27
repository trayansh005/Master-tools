"use client";

import { ReactNode, useState } from "react";
import {
	QueryClient,
	QueryClientProvider,
	HydrationBoundary,
	DehydratedState,
} from "@tanstack/react-query";

export default function ReactQueryProvider({
	children,
	dehydratedState,
}: {
	children: ReactNode;
	dehydratedState?: DehydratedState | null;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5, // 5 minutes
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
		</QueryClientProvider>
	);
}
