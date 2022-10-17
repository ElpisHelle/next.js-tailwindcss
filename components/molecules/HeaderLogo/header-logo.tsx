import React from "react";
import Text from "components/atoms/Typography/text";
import Image from "next/image";
import openSaucedImg from "../../../public/openSauced-icon.png";
import openSaucedImgWithBg from "../../../public/open-sourced-with-bg-icon.png";
import Link from "next/link";

interface HeaderLogoProps {
  textIsBlack?: boolean;
  withBg: boolean;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ textIsBlack, withBg = false }) => {

  return (
    <Link href="/">
      <div className="flex items-center py-2 gap-2 cursor-pointer">
        <Image
          className="rounded"
          alt="Open Sauced Logo"
          width={32}
          height={32}
          src={withBg ? openSaucedImgWithBg : openSaucedImg}
        />
        <Text
          className={`font-semibold text-base hidden xs:block ${textIsBlack ? "!text-black" : "!text-white"}`}
        >
          OpenSauced
        </Text>
      </div>
    </Link>
  );



};

export default HeaderLogo;
