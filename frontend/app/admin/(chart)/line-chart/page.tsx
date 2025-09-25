import LineChartOne from "@/components/charts/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Admin Line Chart | Master Tools",
	description: "Line chart page for admin dashboard",
};
export default function LineChart() {
	return (
		<div>
			<PageBreadcrumb pageTitle="Line Chart" />
			<div className="space-y-6">
				<ComponentCard title="Line Chart 1">
					<LineChartOne />
				</ComponentCard>
			</div>
		</div>
	);
}
