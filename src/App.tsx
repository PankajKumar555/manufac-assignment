import {
  MantineProvider,
  Container,
  Title,
  Box,
  ColorSchemeScript,
} from "@mantine/core";
import AgricultureTable from "./components/Table";
import "./App.css";
import "./index.css";
import BarChart from "./components/BarChart";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <MantineProvider theme={{ fontFamily: "Inter, sans-serif" }}>
      <ColorSchemeScript />
      <Container size="lg">
        <ThemeToggle />
        <Title style={{ textAlign: "center", fontSize: "1.5rem" }}>
          Indian Agriculture Data Visualization
        </Title>
        <Box className="wraper">
          <Box className="table-container">
            <AgricultureTable />
          </Box>
          <Box className="table-container">
            <BarChart />
          </Box>
        </Box>
      </Container>
    </MantineProvider>
  );
}
