import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Admin Bar Chart | Master Tools",
	description: "Bar chart page for admin dashboard",
};

export default function BarChart() {
	return (
		<div>
			<PageBreadcrumb pageTitle="Bar Chart" />
			<div className="space-y-6">
				<ComponentCard title="Bar Chart 1">
					<BarChartOne />
				</ComponentCard>
			</div>
		</div>
	);
}
