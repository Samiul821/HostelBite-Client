import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTheme } from "../../../Hooks/useTheme";

const MealModal = ({ isOpen, closeModal, meal }) => {
  const { isDark } = useTheme();

  if (!meal) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Background Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Content */}
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
                className={`
                  max-w-md w-full transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all
                  ${
                    isDark
                      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
                      : "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-800"
                  }
                `}
              >
                <Dialog.Title
                  as="h3"
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  {meal.title}
                </Dialog.Title>

                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 shadow"
                />

                <p className="mb-2 text-sm">{meal.description}</p>

                <p
                  className={`text-sm mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <strong>Ingredients:</strong> {meal.ingredients}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <span>
                    <strong>Distributor:</strong> {meal.distributor_name}
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ৳ {meal.price}
                  </span>
                </div>

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-semibold shadow transition
                      ${
                        isDark
                          ? "bg-indigo-500 text-white hover:bg-indigo-600"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    onClick={closeModal}
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

export default MealModal;
