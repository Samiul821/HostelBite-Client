import React from "react";
import Banner from "../Banner/Banner";
import MembershipSection from "../Membership/MembershipSection";
import MealsByCategory from "../MealsByCategory/MealsByCategory";
import MealBookingProcess from "../MealBookingProcess/MealBookingProcess";

const Home = () => {
  return (
    <div className=" space-y-16">
      <Banner></Banner>
      <MealsByCategory></MealsByCategory>
      <MembershipSection></MembershipSection>
      <MealBookingProcess />
    </div>
  );
};

export default Home;
