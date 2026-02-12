import React from "react";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contextAuth/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/Dashboard";
import AgentDashboard from "./pages/agent/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CreateTicket from "./pages/customer/CreateTicket";
import MyTickets from "./pages/customer/MyTickets";
import TktCategories from "./pages/admin/TktCategories";
import AssignedTickets from "./pages/agent/AssignedTickets";
import VideoMaster from "./pages/VideoMaster";
import CompanyForm from "./pages/company/CompanyForm";
import CompanyList from "./pages/company/CompanyList";
import CompanyCreate from "./pages/company/CompanyCreate";
import CompanyView from "./pages/company/CompanyView";
import CompanyEdit from "./pages/company/CompanyEdit";
import LocationList from "./pages/location/LocationList";
import LocationCreate from "./pages/location/LocationCreate";
import LocationEdit from "./pages/location/LocationEdit";
import AdvertisementList from "./pages/Advertiesment/AdvertisementList";
import AdvertisementCreate from "./pages/Advertiesment/AdvertisementCreate";
import AdvertisementView from "./pages/Advertiesment/AdvertisementView";
import AdvertisementEdit from "./pages/Advertiesment/AdvertisementEdit";
import AdScreen from "./pages/Advertiesment/AdScreen";
import LiveScreens from "./pages/LiveScreens";
import AddDevice from "./pages/Device/Adddevice";
import DeviceList from "./pages/Device/DeviceList";
/* =========================
   LAYOUT WRAPPER COMPONENT
========================= */
function Layout({ children }) {
  const location = useLocation();

  // Hide Navbar & Footer ONLY on /screen
  const hideLayout = location.pathname.startsWith("/screen");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}

      {/* THIS WRAPPER IS VERY IMPORTANT */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

/* ========================= */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/create_ticket" element={<CreateTicket />} />
            <Route path="/my_tickets" element={<MyTickets />} />
            <Route path="/ticket-categories" element={<TktCategories />} />
            <Route path="/assigned_tickets" element={<AssignedTickets />} />

            <Route path="/company-add" element={<CompanyForm />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/new" element={<CompanyCreate />} />
            <Route path="/companies/:id" element={<CompanyView />} />
            <Route path="/companies/:id/edit" element={<CompanyEdit />} />

            <Route path="/locations" element={<LocationList />} />
            <Route path="/locations/new" element={<LocationCreate />} />
            <Route path="/locations/:id/edit" element={<LocationEdit />} />

            <Route path="/advertisements" element={<AdvertisementList />} />
            <Route path="/advertisements/new" element={<AdvertisementCreate />} />
            <Route path="/advertisements/:id" element={<AdvertisementView />} />
            <Route path="/live-screens" element={<LiveScreens />} />

            {/* ✅ THIS IS YOUR AD SCREEN */}
            {/* <Route path="/screen" element={<AdScreen />} /> */}
            {/* <Route path="/screen/:locationId" element={<AdScreen />} /> */}
            {/* <Route path="/screen/:mac" element={<AdScreen />} /> */}
            <Route path="/screen/:locationId/:deviceId" element={<AdScreen />} />
            <Route path="/screen/:locationId" element={<AdScreen />} />
            {/* <Route path="/screen/:locationId/:deviceId" element={<AdScreen />} /> */}

            <Route path="/add-device" element={<AddDevice />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/edit-device/:id" element={<AddDevice />} />

            <Route
              path="/advertisements/:id/edit"
              element={<AdvertisementEdit />}
            />

            <Route
              path="/customer"
              element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agent"
              element={
                <ProtectedRoute role="agent">
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}












