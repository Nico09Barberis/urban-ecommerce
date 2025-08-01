import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from  "react-hot-toast";
import { FaHome, FaBoxOpen, FaUserFriends } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { PiGearFill } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import { TiDownload } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { IoMdAnalytics } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";


const Sidebar = () => {
  // Estado para manejar la apertura y contracción del Sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // null | 'productos' | 'ventas'
  const navigate = useNavigate();

  const toggleSubmenu = (menu) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

 const handleLogout = () => {
  toast((t) => (
    <span>
      ¿Seguro que deseas cerrar sesión?
      <div className="mt-2 flex justify-center gap-2">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            toast.dismiss(t.id);
            navigate("/");
            window.location.reload();
          }}
          className="bg-black text-white px-3 py-1 rounded hover:opacity-80"
        >
          Sí
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          No
        </button>
      </div>
    </span>
  ), { duration: 5000 });
};


  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#2a2b38] text-[#ffeba7] min-h-screen transition-all duration-300`}
    >
      {/* Encabezado */}
      <div className="p-4 border-b flex justify-between">
        {!isCollapsed && <h2 className="font-oswald uppercase italic tracking-wider text-2xl font-bold">Urban</h2>}
        <button className="p-1 rounded text-white" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <IoIosArrowForward color="#ffeba7" /> : <IoIosArrowBack color="#ffeba7" />}
        </button>
      </div>

      {/* Menú principal */}
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/admin/dashboard"
              className="block text-left font-bold px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              {isCollapsed ? <FaHome /> : "Dashboard"}
            </Link>
          </li>

          {/* Productos */}
          <li className="mb-2">
            <button
              onClick={() => toggleSubmenu("productos")}
              title="Productos"
              className="w-full flex font-bold items-center justify-between text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              <span>{isCollapsed ? <FaBoxOpen /> : "Productos"}</span>
              <span
                className={`transform transition-transform ${
                  openSubmenu === "productos" ? "rotate-180" : "rotate-0"
                }`}
              >
                <IoIosArrowDown />
              </span>
            </button>

            {openSubmenu === "productos" && (
              <ul className={`mt-2 ml-${isCollapsed ? "2" : "4"} font-bold`}>
                <li>
                  <Link
                    to="/admin/products"
                    title="Cargar productos"
                    className="block text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
                  >
                    {isCollapsed ? <TiDownload /> : "Cargar productos"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/products/list"
                    title="Ver productos"
                    className="block text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
                  >
                    {isCollapsed ? <CiBoxList /> : "Ver productos"}
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Ventas */}
          <li className="mb-2">
            <button
              onClick={() => toggleSubmenu("ventas")}
              title="Ventas"
              className="w-full flex font-bold items-center justify-between text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              <span>{isCollapsed ? <TbReportMoney /> : "Ventas"}</span>
              <span
                className={`transform transition-transform ${
                  openSubmenu === "ventas" ? "rotate-180" : "rotate-0"
                }`}
              >
                <IoIosArrowDown />
              </span>
            </button>

            {openSubmenu === "ventas" && (
              <ul className={`mt-2 ml-${isCollapsed ? "2" : "4"} font-bold`}>
                <li>
                  <Link
                    to="/admin/monthly-sales"
                    title="Analisis de ventas"
                    className="block text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
                  >
                    {isCollapsed ? <IoMdAnalytics /> : "Resumen ventas"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/sales"
                    title="Ver ventas"
                    className="block text-left px-4 py-2 hover:bg-[#4a4b57] rounded"
                  >
                    {isCollapsed ? <FaMoneyBillTrendUp /> : "Ver ventas"}
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-2 ">
            <Link
              to="/admin/users" title="Ver usuarios"
              className="block text-left font-bold px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              {isCollapsed ? <FaUserFriends /> : "Usuarios"}
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/notifications" title="Notificaciones"
              className="block text-left font-bold px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              {isCollapsed ? <IoNotifications /> : "Notificaciones"}
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/emails-history" title="Correos enviados"
              className="block text-left font-bold px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              {isCollapsed ? <FaHistory /> : "Correos enviados"}
            </Link>
          </li>
          <li className="mb-2">
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="block text-left w-full font-bold px-4 py-2 hover:bg-[#4a4b57] rounded"
            >
              {isCollapsed ? <BiLogOut /> : "Cerrar sesión"}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
