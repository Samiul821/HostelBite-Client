import React from "react";
import StatisticsCards from "./StatisticsCards ";
import ChartSection from "./ChartSection";
import RecentMealRequests from "./RecentMealRequests";
import { Helmet } from "react-helmet-async";

const AdminHome = () => {
  return (
    <div>
      <Helmet>
        <title>HostelBite | Admin Dashboard</title>
      </Helmet>

      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
      <StatisticsCards />
      <ChartSection></ChartSection>
      <RecentMealRequests />
    </div>
  );
};

export default AdminHome;
