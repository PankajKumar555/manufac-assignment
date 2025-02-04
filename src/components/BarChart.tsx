import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface CropData {
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
}

export default function BarChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    fetch("/data/agricultureData.json")
      .then((res) => res.json())
      .then((data: CropData[]) => {
        const cropMap: Record<string, { total: number; count: number }> = {};

        data.forEach(
          ({
            "Crop Name": crop,
            "Crop Production (UOM:t(Tonnes))": production,
          }) => {
            if (!crop || !production) return;

            const prodValue = parseFloat(production.toString());
            if (!cropMap[crop]) cropMap[crop] = { total: 0, count: 0 };

            cropMap[crop].total += prodValue;
            cropMap[crop].count += 1;
          }
        );

        const cropNames = Object.keys(cropMap);
        const avgProduction = cropNames.map(
          (crop) => cropMap[crop].total / cropMap[crop].count
        );

        chart.setOption({
          title: {
            text: "Average Crop Production",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: cropNames,
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: "value",
            name: "Avg Production (Tonnes)",
          },
          series: [
            {
              data: avgProduction,
              type: "bar",
              itemStyle: { color: "#4CAF50" },
            },
          ],
        });
      })
      .catch((err) => console.error("Error loading chart data:", err));

    return () => chart.dispose();
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px", margin: "auto" }}
    />
  );
}
