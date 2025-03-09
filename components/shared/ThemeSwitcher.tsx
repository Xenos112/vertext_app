"use client";
import { useTheme } from "next-themes";
import { GoSun, GoMoon } from "react-icons/go";
import { FiMonitor } from "react-icons/fi";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering the theme switcher until the component is mounted
  if (!mounted) return null;

  const handleThemeChange = () => {
    switch (theme) {
      case "dark":
        setTheme("light");
        break;
      case "light":
        setTheme("system");
        break;
      case "system":
        setTheme("dark");
        break;
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleThemeChange}>
      {theme === "dark" && <GoMoon />}
      {theme === "light" && <GoSun />}
      {theme === "system" && <FiMonitor />}
    </Button>
  );
}
