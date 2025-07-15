import React from "react";
import StatisticsCards from "./StatisticsCards ";
import ChartSection from "./ChartSection";

const AdminHome = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
      <StatisticsCards />
      <ChartSection></ChartSection>
    </div>
  );
};

export default AdminHome;
