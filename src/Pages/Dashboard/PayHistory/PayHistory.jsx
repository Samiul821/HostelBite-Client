import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { useTheme } from "../../../Hooks/useTheme";
import { useQuery } from "@tanstack/react-query";

const PayHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isDark } = useTheme();

  // ✅ TanStack Query for payment history
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  return (
    <div
      className={`p-4 min-h-screen ${isDark ? "text-white" : "text-gray-800 "}`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Payment History</h2>

      {isLoading && (
        <p className="text-center text-lg text-gray-500">Loading payments...</p>
      )}

      {isError && (
        <p className="text-center text-red-500">
          Error: {error?.message || "Failed to load payment history."}
        </p>
      )}

      {!isLoading && payments.length === 0 ? (
        <p className="text-center text-gray-400">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table
            className={`table w-full border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <thead
              className={`text-sm uppercase ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gradient-to-r from-orange-100 to-pink-100 text-gray-800"
              }`}
            >
              <tr>
                <th className="p-4 text-left">Payment ID</th>
                <th className="p-4 text-left">Package</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className={`transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
                    isDark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50"
                  }`}
                >
                  <td className="p-4 font-mono text-xs break-all">
                    {payment.transactionId || payment._id}
                  </td>
                  <td className="p-4 font-semibold">
                    {payment.packageName || "N/A"}
                  </td>
                  <td className="p-4 font-medium text-green-500">
                    ${payment.amount?.toFixed(2)}
                  </td>
                  <td className="p-4">
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        payment.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {payment.status || "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayHistory;
