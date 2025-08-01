// src/components/dashboard/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './SideBar';
import Dashboard from './Dashboard';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import SalesList from './Sales';
import SalesAnalysis from './salesAnalysis';
import RegisteredUsers from './RegisteredUsers';
import Notifications from './Notifications';
import EmailHistory from './emailHistory';

const AdminRoutes = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#fdf5fd]">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AddProductForm />} />
          <Route path="products/edit/:id" element={<EditProductForm />} />
          <Route path="products/list" element={<ProductList />} />
          <Route path="sales" element={<SalesList />} />
          <Route path="monthly-sales" element={<SalesAnalysis />} />
          <Route path="users" element={<RegisteredUsers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="emails-history" element={<EmailHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
