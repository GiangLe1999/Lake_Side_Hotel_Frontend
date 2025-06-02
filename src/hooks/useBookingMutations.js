import { useMutation } from "@tanstack/react-query";
import {
  addBooking,
  changePaymentMethod,
  confirmBooking,
  resendConfirmationCode,
} from "../service/booking-service";
import { toast } from "react-toastify";
import paymentTypes from "../constants/payment-type";

const useBookingMutations = (setBookingId, setIsCodeSent, startTimer) => {
  const addBookingMutation = useMutation({
    mutationFn: addBooking,
    onSuccess: ({ data }) => {
      const success = data.status === 201;
      toast[success ? "success" : "error"](
        success
          ? "Email with confirmation code has been sent to you"
          : "Failed to send confirmation code to your email"
      );

      if (success) {
        setBookingId(data.data);
        setIsCodeSent(true);
      }
      startTimer();
    },
    onError: (err) => {
      toast.error(`Failed to add booking. ${err.message}`);
      startTimer();
    },
  });

  const resendConfirmationCodeMutation = useMutation({
    mutationFn: resendConfirmationCode,
    onSuccess: ({ data }) => {
      const success = data.status === 200;
      toast[success ? "success" : "error"](
        success
          ? "Resend confirmation successfully"
          : "Failed to resend confirmation code"
      );
      startTimer();
    },
    onError: (err) => {
      toast.error(`Failed to resend confirmation code. ${err.message}`);
      startTimer();
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: confirmBooking,
    onSuccess: ({ data }) => {
      const success = data.status === 200;
      toast[success ? "success" : "error"](
        success
          ? "Booking successfully. Now please choose your payment method."
          : "Failed to confirm booking"
      );
    },
    onError: (err) => {
      toast.error(`Failed to confirm booking. ${err.message}`);
    },
  });

  const changeBookingPaymentMutation = useMutation({
    mutationFn: changePaymentMethod,
    onSuccess: ({ data }) => {
      const success = data.status === 200;
      const paymentLabel =
        data.data === paymentTypes.CASH ? "Pay at Hotel" : "Pay Online";

      toast[success ? "success" : "error"](
        success
          ? `You have selected "${paymentLabel}" successfully.`
          : `Failed to select "${paymentLabel}". Please try again.`
      );
    },
    onError: (err) => {
      toast.error(`Failed to choose payment method. ${err.message}`);
    },
  });

  return {
    addBookingMutation,
    resendConfirmationCodeMutation,
    confirmBookingMutation,
    changeBookingPaymentMutation,
  };
};

export default useBookingMutations;
