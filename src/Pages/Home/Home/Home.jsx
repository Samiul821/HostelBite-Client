import React from "react";
import Banner from "../Banner/Banner";
import MembershipSection from "../Membership/MembershipSection";
import MealsByCategory from "../MealsByCategory/MealsByCategory";
import MealBookingProcess from "../MealBookingProcess/MealBookingProcess";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div className=" space-y-16">
      <Helmet>
        <title>HostelBite | Home</title>
      </Helmet>
      <Banner></Banner>
      <MealsByCategory></MealsByCategory>
      <MembershipSection></MembershipSection>
      <MealBookingProcess />
    </div>
  );
};

export default Home;
