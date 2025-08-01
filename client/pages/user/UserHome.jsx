import { Link } from "react-router-dom";
import NavBar from "../../components/user/layout/NavBar";
import CustomImage from "../../components/user/layout/CustomImage";
import ProductCarousel from "../../components/user/layout/ProductCarousel";
import Footer from "../../components/user/layout/Footer";
import PopularItems from "../../components/user/layout/Popular";
import AboutMe from "../../components/user/layout/AboutMe";
import TopSelections from "../../components/user/layout/TopSelections";
import OfferCarousel from "../../components/user/layout/OfferCarousel";
import DeliveryInfo from "../../components/user/layout/DeliveryInfo";
import { useState, useEffect } from "react";
import LoginForm from "../../components/user/forms/LoginForm";
import RegisterForm from "../../components/user/forms/RegisterForm";


const Home = () => {

  const [modalType, setModalType] = useState(null); // Puede ser 'login', 'register' o null

  useEffect(() => {
    const hasShownModal = sessionStorage.getItem("hasShownLoginModal");

    if (!hasShownModal) {
      setModalType('login');
      sessionStorage.setItem("hasShownLoginModal", "true");
    }
  }, []);

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSwitchToRegister = () => {
    setModalType('register');
  };

  const handleSwitchToLogin = () => {
    setModalType('login');
  };


  return (
    <div className="min-h-screen bg-white">
      
      {modalType === 'login' && (
        <LoginForm
          showModal={true}
          onClose={handleCloseModal}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
      {modalType === 'register' && (
        <RegisterForm
          showModal={true}
          onClose={handleCloseModal}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}

      <NavBar />

        {/* contenedor de la imagen de la página de inicio */}
        <div className="mx-auto mt-6 container pt-40">
          {/* Imagen en el Hero Section */}
          <section className="hero flex items-center justify-center bg-gray-200">
            <CustomImage src="https://i.ibb.co/2T6Sf09/fondo-urban.png" alt="Imagen Hero" className="w-full h-full rounded-none shadow-none object-cover" />
          </section>
        </div>

        {/* carrusel con imagenes*/}
        <div className="mx-4">
          <ProductCarousel />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Imagen 1 con su enlace */}
          <div className="flex flex-col items-center w-[90%] sm:w-[40%]">
            <CustomImage src="https://i.ibb.co/PZKTycpy/dc1ua6e2.png" alt="Imagen 1" className="w-full h-auto rounded-none shadow-none" />
            <Link to="/products/hombre" className="my-2 text-black text-sm font-bold text-left uppercase tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300">
              hombre
            </Link>
          </div>

          {/* Imagen 2 con su enlace */}
          <div className="flex flex-col items-center w-[90%] sm:w-[40%]">
            <CustomImage src="https://i.ibb.co/nNXjKw8Z/6v4pnann.png" alt="Imagen 2" className="w-full h-auto rounded-none shadow-none" />
            <Link to="/products/mujer" className="my-2 text-black text-sm font-bold text-left uppercase tracking-wider border-b-2 border-black hover:bg-gray-300 transition duration-300e">
              mujer
            </Link>
          </div>
        </div>

        <div className="w-[80%] mx-auto">
          <PopularItems />
        </div>

        <div className="mx-4">
          <OfferCarousel />
        </div>

       {/* contenedor de imagen */}
        <div className="mx-auto mt-6 container">
          {/* Imagen en el Hero Section */}
          <section className="hero flex items-center justify-center">
            <CustomImage src="https://i.ibb.co/F4d3NTpx/c1da734357b6d54987b01edfbca5ec49.jpg" alt="Imagen Hero" className="w-full h-full rounded-none shadow-none object-cover" />
          </section>
        </div>

        <div className="container mx-auto sm:px-4 md:px-4 lg:px-0 px-4 mt-6">
          <TopSelections />
        </div>

        <div className="mx-auto mt-6">
          <AboutMe />
        </div>

        <div>
          <DeliveryInfo />
        </div>

      <Footer />
    </div>
  );
};

export default Home;
