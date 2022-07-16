import React from "react";

interface CardProps {
    className?: string;
    children: JSX.Element;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`${className && className} block p-6 bg-white rounded-lg border border-gray-200 shadow-md`}>
      {children}
    </div>
  );
};

export default Card;