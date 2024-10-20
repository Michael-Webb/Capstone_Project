//SizeFrequencyChart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
const chartConfig = {
  count: {
    label: "Product Count",
    color: "#10B981", // Change this color as needed
  },
} satisfies ChartConfig;

interface Product {
  size?: string;
}

interface ChartDataItem {
  size: string;
  count: number;
}

interface SizeFrequencyChartProps {
  data: Product[];
}

export function SizeFrequencyChart({ data }: SizeFrequencyChartProps) {
  //console.log("SizeFrequencyChart data:", data);

  if (!data || data.length === 0) {
    return <div>No size data available</div>;
  }
  // Process the data to count sizes
  const sizeCounts = data.reduce<Record<string, number>>((acc, product) => {
    const size = product.size || "Unknown";
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count
  const chartData: ChartDataItem[] = Object.entries(sizeCounts)
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="size"
          tickLine={false}
          axisLine={false}
        />
        <YAxis dataKey="count" hide />
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
      </BarChart>
    </ChartContainer>
  );
}
