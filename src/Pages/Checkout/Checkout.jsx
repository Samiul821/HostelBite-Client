import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { packageId } = useParams();
  const axiosSecure = useAxiosSecure();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get(`/packages/${packageId}`)
      .then((res) => {
        setPackageData(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load package data.");
        setLoading(false);
      });
  }, [axiosSecure, packageId]);

  if (loading)
    return <p className="text-center mt-8">Loading package details...</p>;

  if (!packageData)
    return <p className="text-center mt-8 text-red-500">Package not found!</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow ">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {packageData.name} Package
      </h1>

      <p className="mb-2 text-indigo-600 font-semibold text-center text-xl">
        Price: ${packageData.price} / month
      </p>

      {packageData.description && (
        <p className="mb-6 text-gray-700 text-center">
          {packageData.description}
        </p>
      )}

      <h2 className="text-lg font-semibold mb-3">Features:</h2>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        {packageData.features && packageData.features.length > 0 ? (
          packageData.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))
        ) : (
          <li>No features listed.</li>
        )}
      </ul>

      <Elements stripe={stripePromise}>
        <CheckoutForm packageData={packageData} />
      </Elements>
    </div>
  );
};

export default Checkout;
