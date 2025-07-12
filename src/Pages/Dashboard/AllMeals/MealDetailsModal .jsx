import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTheme } from "../../../Hooks/useTheme";

const MealDetailsModal = ({ isOpen, closeModal, meal }) => {
  const { isDark } = useTheme();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Overlay */}
          <div
            className={`fixed inset-0 backdrop-blur-sm ${
              isDark ? "bg-black/70" : "bg-black/40"
            }`}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`max-w-md w-full transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all
                  ${
                    isDark
                      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border border-gray-700"
                      : "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-900 border border-gray-300"
                  }
                `}
              >
                <Dialog.Title
                  as="h3"
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-indigo-400" : "text-indigo-700"
                  }`}
                >
                  {meal?.title}
                </Dialog.Title>

                <div
                  className={`mt-2 space-y-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <img
                    src={meal?.image}
                    alt={meal?.title}
                    className="w-full rounded-md shadow-md"
                  />
                  <p>
                    <strong>Likes:</strong> {meal?.likes || 0}
                  </p>
                  <p>
                    <strong>Reviews:</strong> {meal?.reviews_count || 0}
                  </p>
                  <p>
                    <strong>Rating:</strong> {meal?.rating || "N/A"}
                  </p>
                  <p>
                    <strong>Distributor:</strong>{" "}
                    {meal?.distributor_name || "Unknown"}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {meal?.description || "No description available."}
                  </p>
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MealDetailsModal;
