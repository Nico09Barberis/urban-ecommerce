import React from "react";

const CustomImage = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={`rounded-lg shadow-md ${className}`} />;
};

export default CustomImage;
