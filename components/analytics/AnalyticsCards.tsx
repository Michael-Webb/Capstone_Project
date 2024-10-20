"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PriceRangeChart } from "@/components/analytics/PriceRangeChart";
import { SizeFrequencyChart } from "@/components/analytics/SizeFrequencyChart";
import { fetchAnalytics, fetchProductColumn } from "@/app/actions/getInventory";

const formatCurrency = (value: number | null) =>
  value ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "N/A";

interface AnalyticsCardProps {
  type: string;
  title?: string;
  style?: string;
  columnName?: string;
}

export default function AnalyticsCard({ type, title = type, style = "default", columnName }: AnalyticsCardProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let result;
        if (columnName) {
          result = await fetchProductColumn(columnName);
          // Transform the data for SizeFrequencyChart if necessary
          if (style === "SizeFrequencyChart") {
            result = result?.map((item: any) => ({ size: item[columnName] })) || [];
          }
        } else {
          result = await fetchAnalytics(type);
        }
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      }
    };
    loadData();
  }, [type, columnName, style]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  if (data === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (style === "formattedString") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{formatCurrency(data)}</CardContent>
      </Card>
    );
  } else if (style === "string") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{data}</CardContent>
      </Card>
    );
  }

  const ChartComponent = style === "PriceRangeChart" ? PriceRangeChart : SizeFrequencyChart;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full w-full">
          <ChartComponent data={data} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}