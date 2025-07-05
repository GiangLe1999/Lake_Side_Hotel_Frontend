import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import React from "react";
import Modal from "react-modal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ isOpen, setIsOpen, bookingData, customerInfo }) => {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Payment Modal"
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
      ariaHideApp={false}
      // Ngăn modal đóng khi click vào overlay
      shouldCloseOnOverlayClick={false}
      // Tùy chọn: cũng có thể ngăn đóng bằng ESC key
      shouldCloseOnEsc={false}
    >
      <Elements stripe={stripePromise}>
        <PaymentForm
          setIsOpen={setIsOpen}
          bookingData={bookingData}
          customerInfo={customerInfo}
        />
      </Elements>
    </Modal>
  );
};

export default StripePayment;
