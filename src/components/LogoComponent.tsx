import Image from "next/image";
import React from "react";
import logoWhite from "@/assets/images/logo-white.png";

function LogoComponent() {
  return (
    <div>
      <Image
        className="w-28"
        src={logoWhite}
        alt="Metal Zone General Trading LLC Logo"
      />
    </div>
  );
}

export default LogoComponent;
