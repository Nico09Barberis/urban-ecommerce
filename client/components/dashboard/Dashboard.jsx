import React from "react";
import Stats from "./Stats";
import RecentSales from "./RecentSales";
import AdminProfile from "./AdminProfile";
import ContactList from "./ContactList";
import TodoList from "./TodoList";
import Calendar from "./Calendar";
import WeatherCard from "./WeatherCard";
import ChatCard from "./ChatCard";
import LatestUsers from "./LatestUsers";


const Dashboard = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="my-4">
        <h1 className="font-oswald text-left text-4xl italic tracking-wider uppercase font-bold">
          ¡hola, bienvenido de nuevo!
        </h1>
      </div>
      <div className="flex flex-wrap -mx-4">
        {/* Columna izquierda (8/12) */}
        <div className="w-full lg:w-8/12 px-4">
          {/* Secciones dentro de la columna izquierda */}
          <div className="mb-4">
            <div>
              <Stats />
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-white overflow-x-auto rounded-md shadow-md">
              <RecentSales />
            </div>
          </div>
          <div className="mb-4">
            {/* Bloque 2 */}
          </div>
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-6/12 px-2">
              <ContactList />
            </div>
            <div className="w-full md:w-6/12 px-2">
              <TodoList />
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-white overflow-x-auto rounded-md shadow-md">
              <LatestUsers />
            </div>
          </div>
        </div>

        {/* Columna derecha (4/12) */}
        <div className="w-full lg:w-4/12 px-4">
          {/* Secciones dentro de la columna derecha */}
          <div className="mb-4">
            <AdminProfile />
          </div>
          <div className="mb-4 bg-white">
            <Calendar />
          </div>
          <div className="mb-4">
            <ChatCard />
          </div>
          <div className="mb-4">
            <WeatherCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
