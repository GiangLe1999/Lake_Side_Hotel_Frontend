import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { paymentService } from "../../../../service/payment-service";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useWebSocket } from "../../../../hooks/useWebSocket";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily: "Inter, Arial, sans-serif",
      fontSmoothing: "antialiased",
      padding: "12px 16px",
      border: "1px solid #e1e5e9",
      borderRadius: "8px",
    },
    invalid: {
      color: "#dc3545",
      iconColor: "#dc3545",
    },
    complete: {
      color: "#28a745",
      iconColor: "#28a745",
    },
  },
  hidePostalCode: false,
};

const PaymentForm = ({ setIsOpen, bookingData, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // WebSocket listener for payment status updates
  useWebSocket(bookingData.bookingId, null, null, (paymentMessage) => {
    if (paymentMessage.status === "success") {
      toast.success("Payment confirmed successfully!");
      setIsProcessing(false);
    } else if (paymentMessage.status === "failed") {
      toast.error(`Payment failed. Reason: ${paymentMessage.message}`);
      setIsProcessing(false);
    }
  });

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      // Kiểm tra đã có clientSecret chưa để tránh duplicate
      if (clientSecret) {
        console.log("Payment intent already exists");
        return;
      }

      try {
        const paymentRequest = {
          bookingId: bookingData.bookingId,
          amount: bookingData.totalAmount,
          currency: "USD",
        };

        const response = await paymentService.createPaymentIntent(
          paymentRequest
        );
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    };

    if (bookingData?.bookingId && !clientSecret) {
      createPaymentIntent();
    }
  }, [bookingData?.bookingId, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingData.customerName || bookingData.email,
            email: bookingData.email,
          },
        },
      });

      if (paymentIntent.status === "succeeded") {
        toast.info("Payment processing... Please wait for confirmation.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 mb-8 text-white">
        <h3 className="text-2xl font-semibold mb-5 text-white">
          Payment Summary
        </h3>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Booking ID:</span>
              <span className="text-white">#{bookingData.bookingId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Room:</span>
              <span className="text-white">{bookingData.roomName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Check-in:</span>
              <span className="text-white">{bookingData.checkIn}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Check-out:</span>
              <span className="text-white">{bookingData.checkOut}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Nums of Nights:</span>
              <span className="text-white">
                {bookingData.numberOfNights}{" "}
                {bookingData.numberOfNights > 1 ? "nights" : "night"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Nums of Guests:</span>
              <span className="text-white">
                {bookingData.guests}{" "}
                {bookingData.guests > 1 ? "guests" : "guest"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Full Name:</span>
              <span className="text-white">{customerInfo.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Email:</span>
              <span className="text-white">{customerInfo.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/90">Phone Number:</span>
              <span className="text-white">{customerInfo.tel}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold pt-3 mt-3 border-t border-white/20">
              <span className="text-white/90">Total Amount:</span>
              <span className="text-white">${bookingData.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
      >
        <div className="mb-6">
          <label
            htmlFor="card-element"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Credit or Debit Card
          </label>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/10">
            <CardElement id="card-element" options={cardElementOptions} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Secure Payment
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment information is encrypted and secure. We use
                industry-standard SSL encryption.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isProcessing}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm min-w-[120px] transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold text-sm min-w-[120px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-500 disabled:shadow-none relative overflow-hidden"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${bookingData.totalAmount}`
            )}
          </button>
        </div>
      </form>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .max-w-2xl {
            margin: 1rem;
          }

          .flex.gap-4.justify-end {
            flex-direction: column;
          }

          .min-w-[120px] {
            width: 100%;
          }

          .flex.justify-between.items-center {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentForm;
