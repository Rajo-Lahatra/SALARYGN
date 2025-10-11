// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import BatchProcessing from "./pages/batch-processing/index.jsx";
import Login from "./pages/login/index.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import EmployeeManagement from "./pages/employee-management/index.jsx";
import TaxSettings from "./pages/tax-settings/index.jsx";
import EmployeeTaxCalculator from "./pages/employee-tax-calculator/index.jsx";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/batch-processing" element={<BatchProcessing />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
          <Route path="/tax-settings" element={<TaxSettings />} />
          <Route path="/employee-tax-calculator" element={<EmployeeTaxCalculator />} />
          {/* pas de NotFound → redirection vers le dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
