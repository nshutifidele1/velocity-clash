"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format, subDays } from "date-fns"
import * as React from "react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { MatchResult } from "@/lib/types"

interface AdminChartProps {
    data: MatchResult[];
}

export function AdminChart({ data }: AdminChartProps) {
  const chartData = React.useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 29);
    const dateMap = new Map<string, number>();

    // Initialize map with last 30 days
    for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), "MMM d");
        dateMap.set(date, 0);
    }
    
    // Fill map with match data
    data.forEach(match => {
        if (new Date(match.timestamp) >= thirtyDaysAgo) {
            const date = format(new Date(match.timestamp), "MMM d");
            dateMap.set(date, (dateMap.get(date) || 0) + 1);
        }
    });

    return Array.from(dateMap.entries())
        .map(([date, matches]) => ({ date, matches }))
        .reverse();

  }, [data]);

  const chartConfig = {
    matches: {
      label: "Matches",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <div className="w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis 
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="matches"
              type="monotone"
              stroke="var(--color-matches)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
    </div>
  )
}
