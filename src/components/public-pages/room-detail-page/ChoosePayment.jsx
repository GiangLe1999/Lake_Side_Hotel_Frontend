import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import BookingSummary from "./CustomerInfo/BookingSumary";
import paymentTypes from "../../../constants/payment-type";
import { Loading } from "../../common/Loading";
import { useMutation } from "@tanstack/react-query";
import { changePaymentMethod } from "../../../service/booking-service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import StripePayment from "./Payment/StripePayment";
import "./Payment/payment.css";

const ChoosePayment = ({ bookingId, bookingData, customerInfo }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    mutate: changePaymentMethodMutation,
    isPending: changePaymentMethodPending,
  } = useMutation({
    mutationFn: changePaymentMethod,
    onSuccess: (response) => {
      const success = response?.status === 200;
      const paymentMethod = response?.data;

      if (success) {
        if (paymentMethod === paymentTypes.CASH) {
          const paymentLabel = "Pay at Hotel";
          toast.success(`You have selected "${paymentLabel}" successfully.`);
          navigate("/my-bookings", { replace: true });
        } else if (paymentMethod === paymentTypes.ONLINE) {
          // Open Stripe payment modal for online payment
          setIsPaymentModalOpen(true);
        }
      } else {
        toast.error("Failed to select payment method. Please try again.");
      }
    },
    onError: (err) => {
      toast.error(`Failed to choose payment method. ${err.message}`);
    },
  });

  const paymentOptions = [
    {
      id: paymentTypes.ONLINE,
      title: "Pay Online Now",
      description: "Secure payment with credit/debit card",
      icon: CreditCard,
      benefits: [
        "Instant confirmation",
        "Secure payment processing",
        "Digital receipt immediately",
      ],
      buttonText: "Pay Now",
      buttonStyle:
        "bg-gradient-to-r from-green-500 to-emerald-500 text-white duration-500",
    },
    {
      id: paymentTypes.CASH,
      title: "Pay at Check-in",
      description: "Pay with cash when you arrive",
      icon: Wallet,
      benefits: [
        "No online payment required",
        "Pay with cash or card at hotel",
        "Flexible payment options",
      ],
      buttonText: "Reserve with Cash Payment",
      buttonStyle:
        "bg-gradient-to-r from-blue-500 to-blue-700 text-white duration-500",
    },
  ];

  const handlePaymentSelect = async (paymentType) => {
    setSelectedPayment(paymentType);
    changePaymentMethodMutation({
      bookingId,
      paymentMethod: paymentType,
    });
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-[163px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Choose Payment Method
          </h3>
        </div>

        {/* Booking Summary */}
        <BookingSummary bookingData={bookingData} />

        {/* Payment Options */}
        <div className="space-y-4 mb-6">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPayment === option.id;
            const isCurrentlyProcessing =
              changePaymentMethodPending && isSelected;

            return (
              <div
                key={option.id}
                className={`border rounded-2xl p-6 transition-all duration-500 ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-100 hover:border-gray-300"
                } ${
                  changePaymentMethodPending && !isSelected ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      isSelected ? "bg-yellow-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? "text-yellow-600" : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-lg font-semibold text-gray-800">
                        {option.title}
                      </h5>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {option.description}
                    </p>

                    <ul className="space-y-1 mb-4">
                      {option.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePaymentSelect(option.id)}
                      disabled={changePaymentMethodPending}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        option.buttonStyle
                      } ${
                        changePaymentMethodPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                    >
                      {isCurrentlyProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loading />
                        </div>
                      ) : (
                        option.buttonText
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="font-semibold text-blue-800 mb-2">
                Important Information
              </h6>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Your booking is confirmed regardless of payment method
                </li>
                <li>
                  • Free cancellation available up to 24 hours before check-in
                </li>
                <li>• Valid ID required at check-in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Shield className="w-4 h-4" />
          <span>All payment information is secure and encrypted</span>
        </div>

        {/* Support Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Need assistance? Our support team is available 24/7</span>
          </div>
        </div>
      </div>

      <StripePayment
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        bookingData={{ bookingId, ...bookingData }}
        customerInfo={customerInfo}
      />
    </>
  );
};

export default ChoosePayment;
