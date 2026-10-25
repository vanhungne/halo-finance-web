import React from "react";
import CustomerDashboard from "../../pages/customerPortal/CustomerDashboard";

const customerRoute = [
  {
    path: "",
    element: <CustomerDashboard />,
  },
  {
    path: "wallets",
    element: <CustomerDashboard />,
  },
  {
    path: "receipt-ai",
    element: <CustomerDashboard />,
  },
  {
    path: "group-fund",
    element: <CustomerDashboard />,
  },
  {
    path: "investments",
    element: <CustomerDashboard />,
  },
  {
    path: "debts",
    element: <CustomerDashboard />,
  },
  {
    path: "reports",
    element: <CustomerDashboard />,
  },
  {
    path: "security",
    element: <CustomerDashboard />,
  },
];

export default customerRoute;
