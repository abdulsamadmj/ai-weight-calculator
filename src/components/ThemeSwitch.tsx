"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Tooltip } from "flowbite-react";
import React from "react";

function ThemeSwitch() {
  const [lightTheme, setLightTheme] = React.useState<boolean>(false);
  const themeSwitchHandler = () => {
    setLightTheme((theme) => !theme);
  };
  return (
    <Tooltip content={lightTheme ? "Toggle Dark Theme" : "Toggle Light Theme"}>
      <button type="button" className="w-10 h-10 " onClick={themeSwitchHandler}>
        {lightTheme ? (
          <IconMoon className="w-full h-full" />
        ) : (
          <IconSun className="w-full h-full" />
        )}
      </button>
    </Tooltip>
  );
}

export default ThemeSwitch;
