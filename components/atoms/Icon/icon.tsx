import React from "react";
import Image, { StaticImageData } from "next/legacy/image";

interface IconProps {
    IconImage: StaticImageData | string;
    className?: string;
    alt?: string;
    size?: number;
    onClick?: (...args: any) => any;
}

const Icon: React.FC<IconProps> = ({ onClick, className, IconImage, alt, size = 16 }) => {
  return (
    <div className={`${className ? className : ""} inline-flex`}>
      <Image
        onClick={onClick}
        className="items-center justify-center "
        alt={alt ? alt : "Icon"} width={size} height={size} src={IconImage} />
    </div>
  );
};

export default Icon;
