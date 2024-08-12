"use client"

import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";
import logoWhite from "@/assets/images/logo-white.png";
import logoBlack from "@/assets/images/logo-black.png";

function LogoComponent() {
  const { theme } = useTheme();

  return (
    <div>
      <Image
        className="w-28 h-20 object-contain"
        src={theme === "dark" ? logoWhite : logoBlack}
        alt="Metal Zone General Trading LLC Logo"
      />
    </div>
  );
}

export default LogoComponent;
