import React from "react";
import AdminHome from "./AdminHome/AdminHome";
import useUserRole from "../../../Hooks/useUserRole";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";
import UserHome from "./UserHome/UserHome";
const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <LoadingSpinner />;
  }
  if (role === "user") {
    return <UserHome />;
  } else if (role === "admin") {
    return <AdminHome />;
  } else {
    return <h2>Forbidden</h2>;
  }
};

export default DashboardHome;
