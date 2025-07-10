import React from "react";
import Banner from "../Banner/Banner";
import MembershipSection from "../Membership/MembershipSection";

const Home = () => {
  return (
    <div className="py-10 space-y-16">
      <Banner></Banner>
      <MembershipSection></MembershipSection>
    </div>
  );
};

export default Home;
