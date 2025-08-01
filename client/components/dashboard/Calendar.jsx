import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(2); // Marzo (indexado desde 0)
  const [currentYear, setCurrentYear] = useState(2025);
  const [events, setEvents] = useState({});

  // Obtener el número de días en el mes
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Obtener el día de la semana del primer día del mes
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleEvent = (day) => {
    const event = prompt(`Agrega un evento para el día ${day}:`);
    if (event) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [`${currentYear}-${currentMonth}-${day}`]: event,
      }));
    }
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      if (direction === "next") {
        if (prevMonth === 11) {
          setCurrentYear((prevYear) => prevYear + 1); // Cambia al siguiente año
          return 0; // Enero
        }
        return prevMonth + 1;
      } else {
        if (prevMonth === 0) {
          setCurrentYear((prevYear) => prevYear - 1); // Cambia al año anterior
          return 11; // Diciembre
        }
        return prevMonth - 1;
      }
    });
  };

  const renderDays = () => {
    const days = [];
    // Espacios vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border p-4 bg-gray-100"></div>);
    }
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const eventKey = `${currentYear}-${currentMonth}-${day}`;
      days.push(
        <div
          key={day}
          className={`relative border p-4 flex items-center justify-center hover:bg-gray-200 group ${
            events[eventKey] ? "bg-blue-50 cursor-pointer" : ""
          }`}
          onClick={() => handleEvent(day)}
        >
          <div className="text-center">{day}</div>
          {/* Marca si hay un evento */}
          {events[eventKey] && (
            <div className="absolute bottom-2 w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
          {/* Tooltip */}
          {events[eventKey] && (
            <div className="absolute -top-10 w-40 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
              {events[eventKey]}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-2 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400 hide-calendar" 
          onClick={() => handleMonthChange("prev")}
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-2xl font-bold text-[#25396f]">
          {new Date(currentYear, currentMonth).toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <button
          className="px-2 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400 hide-calendar"
          onClick={() => handleMonthChange("next")}
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 hide-calendar">
        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((dayName, index) => (
          <div
            key={index}
            className="font-semibold text-[#25396f] text-center border-b-2 pb-2"
          >
            {dayName}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
