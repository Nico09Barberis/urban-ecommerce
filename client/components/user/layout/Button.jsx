import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";

const Button = ({ to = '/', children }) => {
  const navigate = useNavigate();

  const handleClick = () => { 
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center text-white border-2 border-black bg-black gap-2 p-2 hover:bg-white hover:text-black transition duration-300"
    >
      <FaArrowRight className="" />
      <span className="mr-4 font-semibold">{children}</span>
    </button>
  );
};

export default Button;
