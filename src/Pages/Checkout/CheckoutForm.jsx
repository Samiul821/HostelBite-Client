import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const CheckoutForm = ({ packageData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Step 1: Create Payment Intent from backend
  useEffect(() => {
    if (!packageData?.price || !packageData?.name) return;

    axiosSecure
      .post("/create-payment-intent", { price: packageData.price })
      .then((res) => {
        if (res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          toast.error("Client Secret not received");
          console.error("PaymentIntent response:", res.data);
        }
      })
      .catch((err) => {
        console.error("PaymentIntent error:", err);
        toast.error("Failed to initialize payment");
      });
  }, [packageData, axiosSecure]);

  // Step 2: Handle Payment Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Stripe is not ready");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card element not found");
      return;
    }

    setProcessing(true);

    const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (cardError) {
      toast.error(cardError.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user?.displayName || "Unknown User",
          email: user?.email || "Unknown Email",
        },
      },
    });

    if (confirmError) {
      toast.error(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      const paymentData = {
        email: user?.email,
        name: user?.displayName,
        amount: packageData.price,
        packageName: packageData.name,
        transactionId: paymentIntent.id,
        date: new Date().toISOString(),
      };

      try {
        // 1. Save payment record
        await axiosSecure.post("/payments", paymentData);

        // 2. Update user badge
        await axiosSecure.patch("/users/update-badge", {
          email: user.email,
          badge: packageData.name, // Silver / Gold / Platinum
        });

        toast.success("Payment successful! Badge updated.");
      } catch (err) {
        console.error("Error saving payment or updating badge:", err);
        toast.error("Payment success, but update failed.");
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#374151",
              "::placeholder": {
                color: "#9CA3AF",
              },
            },
            invalid: {
              color: "#EF4444",
            },
          },
        }}
      />

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        {processing ? "Processing..." : `Pay $${packageData.price}`}
      </button>

      {transactionId && (
        <p className="text-green-600 mt-4 text-center">
          ✅ Payment complete! Transaction ID: {transactionId}
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
