import { Table, Container } from "@mantine/core";
import { useEffect, useState } from "react";

interface CropData {
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
}

export default function AgricultureTable() {
  const [tableData, setTableData] = useState<
    { year: number; maxCrop: string; minCrop: string }[]
  >([]);

  useEffect(() => {
    fetch("/data/agricultureData.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: CropData[]) => {
        const yearMap: Record<number, { max: CropData; min: CropData }> = {};

        data.forEach((entry) => {
          const yearMatch = entry.Year.match(/\d{4}/);
          if (!yearMatch) return;
          const year = parseInt(yearMatch[0]);

          const production = entry["Crop Production (UOM:t(Tonnes))"]
            ? parseFloat(entry["Crop Production (UOM:t(Tonnes))"].toString())
            : 0;

          if (!yearMap[year]) {
            yearMap[year] = { max: entry, min: entry };
          } else {
            if (
              production >
              parseFloat(
                yearMap[year].max["Crop Production (UOM:t(Tonnes))"].toString()
              )
            ) {
              yearMap[year].max = entry;
            }
            if (
              production <
              parseFloat(
                yearMap[year].min["Crop Production (UOM:t(Tonnes))"].toString()
              )
            ) {
              yearMap[year].min = entry;
            }
          }
        });

        const formattedData = Object.entries(yearMap).map(
          ([year, { max, min }]) => ({
            year: parseInt(year),
            maxCrop: max["Crop Name"],
            minCrop: min["Crop Name"],
          })
        );

        setTableData(formattedData);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  return (
    <Container className="table-container" style={{ margin: "auto" }}>
      <Table
        withTableBorder
        style={{
          width: "100%",
          margin: "auto",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "center",
                padding: "0px 8px",
              }}
            >
              Year
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "0px 8px",
              }}
            >
              Crop with Maximum Production in that Year{" "}
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "0px 8px",
              }}
            >
              Crop with Minimum Production in that Year{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.year}>
              <td
                style={{
                  textAlign: "center",
                  padding: "0px 8px",
                }}
              >
                {row.year}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "0px 8px",
                }}
              >
                {row.maxCrop}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "0px 8px",
                }}
              >
                {row.minCrop}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
