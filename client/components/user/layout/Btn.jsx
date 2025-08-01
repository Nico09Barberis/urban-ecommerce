import React from "react";

const Btn = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#68A1D4] text-white w-full py-2 px-6 border hover:border-[#1F3A64] opacity-100 hover:opacity-80
      active:bg-[#fcf414] active:shadow-none active:translate-y-1"
    >
      <span className="text-md font-semibold z-10">{text}</span>
    </button>
  );
};

export default Btn;
