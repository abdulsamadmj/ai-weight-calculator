import React from "react";
import LogoComponent from "./LogoComponent";
import ThemeSwitch from "./ThemeSwitch";

function Navbar() {
  return (
    <div className="flex justify-between items-center max-w-screen-xl w-full p-5">
      <LogoComponent />
      {/* <h1 className="text-xl font-bold">AI Steel Equipment Weight Calculator (Beta)</h1> */}
      <ThemeSwitch />
    </div>
  );
}

export default Navbar;
