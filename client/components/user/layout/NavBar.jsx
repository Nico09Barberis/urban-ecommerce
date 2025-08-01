import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Hook para navegación
import toast from "react-hot-toast"; // Librería para notificaciones
import { FaUserCircle, FaHeart } from "react-icons/fa"; // Iconos de usuario y favoritos
import { RxHamburgerMenu } from "react-icons/rx"; // Icono del menú hamburguesa
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Flechas para desplegar submenús
import { SiAppstore } from "react-icons/si"; // Icono de apps (no usado en este bloque)
import { PiHandbagBold } from "react-icons/pi"; // Icono de bolso o carrito
import NoticesCarousel from "./NoticesCarousel"; // Carrusel de avisos
import Search from "./Search"; // Componente de búsqueda
import LoginForm from "../forms/LoginForm"; // Formulario de login
import RegisterForm from "../forms/RegisterForm"; // Formulario de registro

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para abrir/cerrar el sidebar
  const [activeCategory, setActiveCategory] = useState(null); // Categoría activa desplegada
  const navigate = useNavigate(); // Hook para redirección
  const [profileIsOpen, setProfileIsOpen] = useState(false); // Estado del menú de perfil
  const [hoveredCategory, setHoveredCategory] = useState(null); // Categoría sobre la que se pasa el mouse
  const [timeoutId, setTimeoutId] = useState(null); // Timeout para manejar hover (no usado en este bloque)
  const [showLoginModal, setShowLoginModal] = useState(false); // Mostrar modal de login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Mostrar modal de registro

  const token = localStorage.getItem("token"); // Obtenemos token del localStorage
  const user = token ? JSON.parse(localStorage.getItem("user")) : null; // Obtenemos el usuario si existe

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Alternamos visibilidad del sidebar
  };

  const toggleSubmenu = (categoryName) => {
    // Alternamos submenú según la categoría
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  // Función para cerrar sesión con confirmación
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
              window.location.reload(); // Recargamos para reflejar el logout
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

  // Redirige a la página de productos por categoría
  const handleCategoryClick = (categoryName) => {
    navigate(`/products/${categoryName.toLowerCase().replace(/\s+/g, "-")}`);
  };

  // Redirige a la página de productos por subcategoría
  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    navigate(
      `/products/${categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")}/${subcategoryName
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
  };

  // Definicion de las categorías y sus subcategorías
  const categories = [
    {
      name: "Hombre",
      subcategories: [
        "Camisas",
        "Polos",
        "Camisetas",
        "Hoodies",
        "Parkas",
        "Pantalones",
        "Jeans",
        "Bermudas",
        "Ropa Interior",
      ],
    },
    {
      name: "Mujer",
      subcategories: [
        "Camisas",
        "Hoodies",
        "Camisetas",
        "Jeans",
        "Parkas",
        "Bermudas",
        "Pantalones",
      ],
    },
    {
      name: "Niños",
      subcategories: [
        "Camisas",
        "Vestidos",
        "Pantalones",
        "Abrigos",
        "Zapatos",
        "Juguetes",
      ],
    },
    {
      name: "Accesorios",
      subcategories: [
        "Sombreros",
        "Gorras",
        "Bufandas",
        "Medias",
        "Relojes",
        "Bolsos",
        "Joyeria",
      ],
    },
    {
      name: "Calzado",
      subcategories: [
        "Vans", 
        "Converse", 
        "New Balance", 
        "DC Shoes"
      ],
    },
  ];


  return (
    <header>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
  
      {/* NavBar principal */}
      <nav className="bg-[#2a2b38] fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center p-2 font-oswald text-[#ffeba7] italic font-bold uppercase text-2xl tracking-wide">
            urban
          </Link>
  
          {/* Menú en pantallas grandes */}
          <ul className="hidden lg:flex space-x-6">
            {categories.map((category) => (
              <li
                key={category.name}
                className={`relative transition-all duration-300 ${
                  hoveredCategory && hoveredCategory !== category.name
                    ? "opacity-40"
                    : "opacity-100"
                }`}
                onMouseEnter={() => {
                  if (timeoutId) clearTimeout(timeoutId);
                  setHoveredCategory(category.name);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => {
                    setHoveredCategory(null);
                  }, 100);
                  setTimeoutId(id);
                }}
              >
                <span
                  onClick={() => handleCategoryClick(category.name)}
                  className="text-[#ffeba7] mx-4 font-semibold uppercase tracking-widest cursor-pointer"
                >
                  {category.name}
                </span>
                <div
                  className={`absolute left-0 w-full h-0.5 bg-[#ffeba7] origin-left transition-transform duration-0 ${
                    hoveredCategory === category.name ? "scale-x-100" : "scale-x-0"
                  }`}
                ></div>
                <div
                  className={`absolute left-0 top-full translate-y-1 bg-[#2a2b38] shadow-lg rounded-md transition-all duration-300 z-50 min-w-[160px] py-2 ${
                    hoveredCategory === category.name
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ul className="py-1">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory}
                        className="px-4 py-2 bg-[#2a2b38] text-[#ffeba7] text-left tracking-wider hover:bg-[#4a4b57] cursor-pointer"
                        onClick={() =>
                          handleSubcategoryClick(category.name, subcategory)
                        }
                      >
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
  
          {/* Opciones (Búsqueda, perfil, favoritos, carrito) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="w-full">
              <Search />
            </div>
  
            {/* Perfil */}
            <div className="relative">
              <button
                className="flex items-center p-2 focus:outline-none"
                onClick={() => setProfileIsOpen(!profileIsOpen)}
              >
                <FaUserCircle fontSize={24} className="mr-2 text-[#ffeba7] hover:scale-125 transition duration-100" />
              </button>
  
              {profileIsOpen && (
                <div className="absolute right-0 mt-2 w-40 text-left font-semibold bg-[#2a2b38] border-gray-700 rounded shadow-md z-50">
                  <ul className="py-2 text-[#ffeba7]">
                    {token ? (
                      <>
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Mi cuenta
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Cerrar sesión
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <button
                            onClick={() => setShowLoginModal(true)}
                            className="block w-full text-left px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Iniciar sesión
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
  
            {/* Favoritos */}
            <Link to="/favorites" className="flex items-center p-2">
              <FaHeart fontSize={24} className="mr-2 text-[#ffeba7] hover:scale-125 transition duration-100" />
            </Link>
  
            {/* Carrito */}
            <Link to="/cart" className="flex items-center p-2">
              <PiHandbagBold fontSize={24} className="mr-2 text-[#ffeba7] hover:scale-125 transition duration-100" />
            </Link>
          </div>
  
          {/* Menú hamburguesa */}
          <button
            className="lg:hidden text-[#ffeba7]"
            onClick={toggleSidebar}
            aria-label="Abrir menú"
          >
            <RxHamburgerMenu />
          </button>
        </div>
  
        {/* Sección Inferior de noticias */}
        <NoticesCarousel />
      </nav>
  
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#2a2b38] shadow-lg z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-4 py-4 bg-[#2a2b38] text-[#ffeba7] transition-all duration-100">
          <h3 className="text-lg font-bold">Menú</h3>
          <button
            onClick={toggleSidebar}
            className="text-gray-800"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className="w-full">
          <Search />
        </div>
        
        <ul className="mt-4">
          {categories.map((category) => (
            <li key={category.name} className="py-2 px-4 bg-[#2a2b38]">
              <div
                className="flex justify-between items-center cursor-pointer text-left tracking-wider font-semibold p-2 sm:text-xs hover:bg-[#4a4b57] rounded"
                onClick={() => toggleSubmenu(category.name)}
              >
                <span className="text-[#ffeba7]">{category.name}</span>
                <span>
                  {activeCategory === category.name ? (
                    <IoIosArrowUp className="text-[#ffeba7]" />
                  ) : (
                    <IoIosArrowDown className="text-[#ffeba7]" />
                  )}
                </span>
              </div>
              {activeCategory === category.name && (
                <ul className="ml-4 mt-2  text-[#ffeba7]">
                  {category.subcategories.map((subcategory) => (
                    <li
                      key={subcategory}
                      className="flex justify-between items-center cursor-pointer text-left tracking-wider p-2 sm:text-xs hover:bg-[#4a4b57] rounded"
                    >
                      <Link to="">{subcategory}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
  
        {/* Opciones adicionales Sidebar */}
        <div className="px-4 text-[#ffeba7] bg-[#2a2b38] justify-between font-semibold items-center cursor-pointer text-left tracking-wider sm:text-xs rounded">
          
          {/* Favoritos */}
          <Link to="/favorites" className="flex items-center mt-4 p-2 hover:bg-[#4a4b57] rounded">
            <span>Favoritos</span>
          </Link>

          {/* Carrito */}
          <Link to="/cart" className="flex items-center mt-4 p-2 hover:bg-[#4a4b57] rounded">
            <span>Carrito</span>
          </Link>

          {/* Perfil */}
          <div className="relative mt-4">
              <button
                className="flex items-center justify-between w-full p-2 focus:outline-none"
                onClick={() => setProfileIsOpen(!profileIsOpen)}
              >
              <span>Perfil</span>
                {profileIsOpen ? (
                  <IoIosArrowUp className="ml-2 text-[#ffeba7]" />
                ) : (
                  <IoIosArrowDown className="ml-2 text-[#ffeba7]" />
                )}
              </button>
  
              {profileIsOpen && (
                <div className="absolute left-0 w-full text-left font-semibold bg-[#2a2b38] border-gray-700 rounded z-50">
                  <ul className="py-2 text-[#ffeba7]">
                    {token ? (
                      <>
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Mi cuenta
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Cerrar sesión
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <button
                            onClick={() => setShowLoginModal(true)}
                            className="block w-full text-left px-4 py-2 hover:bg-[#4a4b57]"
                          >
                            Iniciar sesión
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          
        </div>
      </div>
      <LoginForm
      showModal={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSwitchToRegister={() => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
      }}
    />

    <RegisterForm
      showModal={showRegisterModal}
      onClose={() => setShowRegisterModal(false)}
      />

    </header>
  );
};

export default NavBar;
