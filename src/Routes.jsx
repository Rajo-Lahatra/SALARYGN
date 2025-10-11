// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import BatchProcessing from "./pages/batch-processing";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import EmployeeManagement from "./pages/employee-management";
import TaxSettings from "./pages/tax-settings";
import EmployeeTaxCalculator from "./pages/employee-tax-calculator";

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
