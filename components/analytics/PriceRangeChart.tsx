"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";


interface PriceRangeData {
  price_range: string;
  id_count: number;
}

interface ChartDataItem {
  range: string;
  count: number;
}

const chartConfig = {
  count: {
    label: "Product Count",
    color: "#2563eb",
  },
} satisfies ChartConfig;

// Helper function to extract the lower bound of the price range
const getLowerBound = (range: string): number => {
  const match = range.match(/^\d+/);
  return match ? parseInt(match[0], 10) : Infinity;
};

export function PriceRangeChart({ data }: { data: PriceRangeData[] }) {
  // Transform the data to match the expected format and sort it
  const chartData = data
    .map((item) => ({
      range: item.price_range,
      count: item.id_count,
    }))
    .sort((a, b) => {
      // Sort based on the lower bound of the price range
      return getLowerBound(a.range) - getLowerBound(b.range);
    });

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="range"
          tickLine={false}
          axisLine={false}

        />
        <YAxis
          dataKey="count"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
      </BarChart>
    </ChartContainer>
  );
}
