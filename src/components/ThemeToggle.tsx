import { useState, useEffect } from "react";
import { ActionIcon } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  const toggleColorScheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    document.documentElement.setAttribute(
      "data-mantine-color-scheme",
      newScheme
    );
    localStorage.setItem("theme", newScheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-mantine-color-scheme",
      colorScheme
    );
  }, [colorScheme]);

  return (
    <ActionIcon onClick={toggleColorScheme} variant="light" size="lg">
      {colorScheme === "dark" ? <Sun color="black" /> : <Moon color="black" />}
    </ActionIcon>
  );
}
