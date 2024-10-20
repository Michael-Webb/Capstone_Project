"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Product Count",
    color: "#10B981", // Change this color as needed
  },
} satisfies ChartConfig;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      size: string;
    };
  }>;
}

const ChartTooltipContent: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Size</span>
            <span className="font-bold text-muted-foreground">{payload[0].payload.size}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Count</span>
            <span className="font-bold">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ChartLegendContent: React.FC = () => (
  <div className="flex items-center justify-end gap-4">
    <div className="flex items-center gap-1 text-sm">
      <div className="h-3 w-3 rounded-full bg-[var(--color-count)]" />
      <span>Product Count</span>
    </div>
  </div>
);

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
        <XAxis dataKey="size" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} hide/>
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
      </BarChart>
    </ChartContainer>
  );
}
