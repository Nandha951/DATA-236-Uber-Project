import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

import DriverList from './pages/DriverList';
import AddDriver from './pages/AddDriver';
import EditDriver from './pages/EditDriver';
import DriverSignup from './pages/DriverSignup';
import DriverLogin from './pages/DriverLogin';
import DriverSummary from './pages/DriverSummary';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import RideListByDriver from './pages/RideListByDriver';
import DriverProfile from './pages/DriverProfile';
import DriverEditProfile from './pages/DriverEditProfile';
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';
import CustomerProfile from './pages/CustomerProfile';
import CustomerBookRide from './pages/CustomerBookRide';
import CustomerRides from './pages/CustomerRides';
import DriverBilling from './pages/DriverBilling';
import CustomerBilling from './pages/CustomerBilling';
import AdminSignup from './features/admin/AdminSignup';
import AdminLogin from './features/admin/AdminLogin';
import ProtectedAdminRoute from './features/admin/ProtectedAdminRoute';
import AdminDashboard from './features/admin/AdminDashboard';
import AddDriverByAdmin from './features/admin/AddDriverByAdmin';
import AddCustomerByAdmin from './features/admin/AddCustomerByAdmin';
import ReviewDriver from './features/admin/ReviewDriver';
import RevenueChart from './features/admin/RevenueChart';
import BillSearch from './features/admin/BillSearch';
import ReviewCustomer from './features/admin/ReviewCustomer';
import CustomerEditProfile from './pages/CustomerEditProfile';
import AdminLayout from './features/admin/AdminLayout';

const RideListByDriverWrapper = () => {
  const { id } = useParams();
  return <RideListByDriver driverId={id} />;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {!isAdminRoute && <AppNavbar />}
      <Container fluid className="main-content py-4">
        <div className="fade-in">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Driver routes */}
            <Route path="/drivers" element={<DriverList />} />
            <Route path="/drivers/new" element={<AddDriver />} />
            <Route path="/drivers/edit/:id" element={<EditDriver />} />
            <Route path="/drivers/signup" element={<DriverSignup />} />
            <Route path="/drivers/login" element={<DriverLogin />} />
            <Route path="/drivers/:id/summary" element={<DriverSummary />} />
            <Route path="/drivers/:id/rides" element={<RideListByDriverWrapper />} />
            <Route path="/drivers/:id/profile" element={<DriverProfile />} />
            <Route path="/drivers/:id/edit-profile" element={<DriverEditProfile />} />
            <Route path="/drivers/:id/billing" element={<DriverBilling />} />

            {/* Customer routes */}
            <Route path="/customers/signup" element={<CustomerSignup />} />
            <Route path="/customers/login" element={<CustomerLogin />} />
            <Route path="/customers/:id/profile" element={<CustomerProfile />} />
            <Route path="/customers/:id/book" element={<CustomerBookRide />} />
            <Route path="/customers/:id/rides" element={<CustomerRides />} />
            <Route path="/customers/:id/billing" element={<CustomerBilling />} />
            <Route path="/customers/:id/edit-profile" element={<CustomerEditProfile />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/add-driver"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AddDriverByAdmin />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/add-customer"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AddCustomerByAdmin />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/review-driver"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ReviewDriver />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/revenue"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <RevenueChart />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/bill-search"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <BillSearch />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/review-customer"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ReviewCustomer />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </div>
      </Container>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
