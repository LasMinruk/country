// Import React and routing components
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import page components
import Home from "./pages/Home";
import CountryDetail from "./pages/CountryDetail";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import LiveTimer from "./pages/LiveTimer";
import CountryComparison from "./pages/CountryComparison";
import { LoginModalProvider } from "./contexts/LoginModalContext";

// Main App component that handles routing
const App = () => {
  return (
    <LoginModalProvider>
    <Layout>
      <Routes>
        {/* Main routes for the application */}
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="/live-timer" element={<LiveTimer />} />
          <Route path="/comparison" element={<CountryComparison />} />
        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
    </LoginModalProvider>
  );
};

export default App;
