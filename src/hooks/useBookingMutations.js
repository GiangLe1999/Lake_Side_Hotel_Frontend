import { useMutation } from "@tanstack/react-query";
import {
  addBooking,
  confirmBooking,
  resendConfirmationCode,
} from "../service/booking-service";
import { toast } from "react-toastify";

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

  return {
    addBookingMutation,
    resendConfirmationCodeMutation,
    confirmBookingMutation,
  };
};

export default useBookingMutations;
