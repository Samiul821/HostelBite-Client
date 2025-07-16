import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLaout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import SignUp from "../Pages/Auth/SignUp/SignUp";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import AddMeal from "../Pages/Dashboard/AddMeal/AddMeal";
import AdminRoute from "../routes/AdminRoute";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import Checkout from "../Pages/Checkout/Checkout";
import LoadingSpinner from "../Pages/Shared/LoadingSpinner/LoadingSpinner";
import MealDetails from "../Pages/MealDetails/MealDetails";
import Meals from "../Pages/Meals/Meals";
import RequestedMeals from "../Pages/Dashboard/ReqMeals/RequestedMeals ";
import MyReviews from "../Pages/Dashboard/MyReviews/MyReviews";
import PayHistory from "../Pages/Dashboard/PayHistory/PayHistory";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import AllMeals from "../Pages/Dashboard/AllMeals/AllMeals";
import UpdateMeal from "../Pages/Dashboard/AllMeals/UpdateMeal";
import AllReviews from "../Pages/Dashboard/AllReviews/AllReviews";
import ServeMeals from "../Pages/Dashboard/ServeMeals/ServeMeals";
import UpcomingMeals from "../Pages/Dashboard/UpcomingMeals/UpcomingMeals";
import AddMealPage from "../Pages/Dashboard/UpcomingMeals/AddMealPage";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import UserRoute from "../routes/UserRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/meals",
        Component: Meals,
      },
      {
        path: "/meals-details/:id",
        element: (
          <PrivateRoute>
            <MealDetails></MealDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout/:packageId",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLaout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "signup",
        Component: SignUp,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      // User Route
      {
        path: "req-meals",
        element: (
          <UserRoute>
            <RequestedMeals></RequestedMeals>
          </UserRoute>
        ),
      },
      {
        path: "my-reviews",
        element: (
          <UserRoute>
            <MyReviews></MyReviews>
          </UserRoute>
        ),
      },
      {
        path: "pay-history",
        element: (
          <UserRoute>
            <PayHistory></PayHistory>
          </UserRoute>
        ),
      },
      {
        path: "my-profile",
        element: <UserRoute></UserRoute>,
      },

      // Adimin route
      {
        path: "add-meal",
        element: (
          <AdminRoute>
            <AddMeal></AddMeal>
          </AdminRoute>
        ),
      },
      {
        path: "manege-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "allMeals",
        element: (
          <AdminRoute>
            <AllMeals></AllMeals>
          </AdminRoute>
        ),
      },
      {
        path: "update-meal/:id",
        element: (
          <AdminRoute>
            <UpdateMeal />
          </AdminRoute>
        ),
      },
      {
        path: "all-reviews",
        element: (
          <AdminRoute>
            <AllReviews></AllReviews>
          </AdminRoute>
        ),
      },
      {
        path: "serve-meals",
        element: (
          <AdminRoute>
            <ServeMeals></ServeMeals>
          </AdminRoute>
        ),
      },
      {
        path: "upcoming-meals",
        element: (
          <AdminRoute>
            <UpcomingMeals></UpcomingMeals>
          </AdminRoute>
        ),
      },
      {
        path: "add-upcoming-meal",
        element: (
          <AdminRoute>
            <AddMealPage></AddMealPage>
          </AdminRoute>
        ),
      },
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile></AdminProfile>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
