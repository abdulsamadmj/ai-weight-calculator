import React from "react";
import LogoComponent from "./LogoComponent";
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";
import {
  IconAlertTriangleFilled,
  IconBrandOpenai,
  IconExternalLink,
} from "@tabler/icons-react";

function Navbar() {
  return (
    <div className="flex justify-between items-center max-w-screen-xl w-full p-5">
      <LogoComponent />
      <div className="flex gap-2 items-center">
        <Link
          href={
            "https://chatgpt.com/g/g-ZwljYrSiH-steel-weight-calculator-by-metalzoneuae-com"
          }
          target="_blank"
          className="flex gap-1 text-white bg-[#212121] hover:bg-[#171717] p-4 rounded-[20px]"
        >
          <IconBrandOpenai />
          CustomGPT
          <IconExternalLink className="h-4" />
        </Link>
        <ThemeSwitch />
      </div>
      <Link href={""} className="absolute bottom-5 flex gap-1">
        Report a Problem <IconAlertTriangleFilled />
      </Link>
    </div>
  );
}

export default Navbar;
