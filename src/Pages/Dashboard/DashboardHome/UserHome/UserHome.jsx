import React from "react";
import UserSummary from "./UserSummary";
import UserChartSection from "./UserChartSection";

const UserHome = () => {
  return (
    <div>
      <UserSummary />
      <UserChartSection />
    </div>
  );
};

export default UserHome;
