import React, { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { HiMiniUsers } from "react-icons/hi2";

const Stats = () => {
  const [salesTotal, setSalesTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
 
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setSalesTotal(data.salesTotal);
        setUsersTotal(data.usersTotal);
      })
      .catch((error) => console.error("Error al obtener estadísticas:", error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: "Cantidad de ventas realizadas este mes",
          value: salesTotal,
          color: "bg-indigo-300",
          icon: (
            <FaMoneyBillTrendUp className="text-2xl text-white" />
          ),
        },
        {
          title: "Cantidad de usuarios registrados este mes",
          value: usersTotal,
          color: "bg-green-200",
          icon: (
            <HiMiniUsers className="text-2xl text-black" />
          ),
        },
      ].map((item, index) => (
        <div key={index} className="bg-white rounded-lg p-6 flex items-center shadow-md">
          <div className={`${item.color} p-4 rounded-md flex-shrink-0`}>
            {item.icon}
          </div>
          <div className="ml-4">
            <h6 className="text-gray-600 font-semibold">{item.title}</h6>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
