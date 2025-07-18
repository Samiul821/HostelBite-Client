import React from "react";
import UserSummary from "./UserSummary";
import UserChartSection from "./UserChartSection";
import { Helmet } from "react-helmet-async";

const UserHome = () => {
  return (
    <div>
      <Helmet>
        <title>HostelBite | User Dashboard</title>
      </Helmet>

      <UserSummary />
      <UserChartSection />
    </div>
  );
};

export default UserHome;
