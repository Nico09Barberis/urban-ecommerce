import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RequireAdmin from '../components/dashboard/RequireAdmin';
import AdminRoutes from '../components/dashboard/AdminRoutes';

//componentes
import RegisterForm from '../components/user/forms/RegisterForm';
import LoginForm from '../components/user/forms/LoginForm';
import Home from '../pages/user/UserHome';
import NotFound from '../pages/shared/NotFound';

//page
import UserProfile from '../pages/user/userInfo/Profile';
import PersonalInfoForm from '../pages/user/userInfo/PersonalInfo';
import Address from '../pages/user/userInfo/Address';
import Products from '../components/user/layout/Products';
import ProductDetail from '../components/user/layout/ProductDetail';
import Cart from '../pages/user/buy/UserCart';
import Success from '../pages/user/buy/Success';
import Favorites from '../pages/user/Favorites';
import PurchaseHistory from '../pages/user/userInfo/History';
//import Delivery from './components/user/pages/buy/delivery';

//Footer
import PrivacyPolicy from '../pages/user/Footer/PrivacyPolicy';
import TermsAndConditions from '../pages/user/Footer/Terms';
import HelpCenter from '../pages/user/Footer/HelpCenter'
import ReturnsExchanges from '../pages/user/Footer/ReturnExchanges';
import PaymentMethods from '../pages/user/Footer/PaymentMethods';
import Contact from '../pages/user/Footer/Contact';
import AboutUs from '../pages/user/Footer/AboutUs';
import CodeOfConduct from '../pages/user/Footer/CodeOfConduct';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Contenedor con fondo rosado */}

        <Toaster position="top-right" reversedOrder={false} />

        <div className="bg-[#fdf1fd] min-h-screen">
          <Routes>
            {/* Rutas de Administrador */}
            <Route
              path="/admin/*"
              element={
              <RequireAdmin>
                <AdminRoutes />
              </RequireAdmin>
              }
            />

            {/* Rutas de Usuario */}
            <Route path="/profile" element={<UserProfile />} /> {/* Perfil */}
              <Route path="personal-info" element={<PersonalInfoForm />} />
              <Route path="addresses" element={<Address />} />
              <Route path="purchase-history" element={<PurchaseHistory />} />
            <Route path='/cart' element={<Cart />} />
            {/*<Route path="/delivery" element={<Delivery />} />*/}
            <Route path="/success" element={<Success />} />
            <Route path="/favorites" element={<Favorites />} />

            {/* Rutas Generales */}
            <Route path="/" element={<Navigate to="/home" replace />} /> {/* Página de inicio del usuario */}
            <Route path="/home" element={<Home />} /> {/* Página de inicio del usuario */}
            <Route path="/login" element={<LoginForm />} /> {/* Inicio de sesión */}
            <Route path="/register" element={<RegisterForm />} /> {/* Registro */}
            <Route path="*" element={<NotFound />} /> {/* Página no encontrada */}
            <Route path="/products/" element={<Products />} />
            <Route path="/products/:category/:subcategory/:id" element={<ProductDetail />} />
            <Route path="/products/:category/:subcategory?" element={<Products />} />

            {/* Rutas del Footer */}
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/return-exchanges" element={<ReturnsExchanges />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/code-of-conduct" element={<CodeOfConduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


