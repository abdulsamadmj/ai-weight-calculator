"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { Tooltip } from "flowbite-react";
import React from "react";
import { useTheme } from "next-themes";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";

  const themeSwitchHandler = () => {
    setTheme(isLightTheme ? "dark" : "light");
  };

  return (
    <Tooltip
      className="dark:bg-white bg-black text-white dark:text-black px-2"
      arrow={false}
      content={isLightTheme ? "Toggle Dark Theme" : "Toggle Light Theme"}
    >
      <button type="button" className="w-10 h-10" onClick={themeSwitchHandler}>
        {isLightTheme ? (
          <IconMoon className="w-full h-full" />
        ) : (
          <IconSun className="w-full h-full" />
        )}
      </button>
    </Tooltip>
  );
}

export default ThemeSwitch;
