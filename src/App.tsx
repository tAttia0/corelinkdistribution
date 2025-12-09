// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import { OrderProvider } from './context/OrderContext';
import CompanyInputPage from './pages/CompanyInputPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import ProductSelectionPage from './pages/ProductSelectionPage';

// Define route paths for better organization
export const ROUTES = {
  COMPANY_INPUT: '/',
  PRODUCT_SELECTION: '/products',
  ORDER_SUMMARY: '/summary',
};

const App = () => {

  //  useEffect(() => {
  //     // ⚠️ IMPORTANT: UNCOMMENT THIS LINE, RUN THE APP ONCE, 
  //     // CHECK FIREBASE CONSOLE, THEN IMMEDIATELY COMMENT IT OUT OR REMOVE IT!
  //     seedProductsForTesting(); 
  //   }, []);


  return (
    <Router>
      <OrderProvider>
        <Routes>
          {/* All main application pages use the AppLayout */}
          <Route path={ROUTES.COMPANY_INPUT} element={<AppLayout />}>
            <Route index element={<CompanyInputPage />} />
            <Route path={ROUTES.PRODUCT_SELECTION} element={<ProductSelectionPage />} />
            <Route path={ROUTES.ORDER_SUMMARY} element={<OrderSummaryPage />} />
          </Route>
          {/* Add a not-found route later if needed */}
        </Routes>
      </OrderProvider>
    </Router>
  );
};

export default App;