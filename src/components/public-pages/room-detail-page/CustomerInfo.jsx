import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import formatPriceUSD from "../../../utils/format-price";
import {
  Phone,
  Shield,
  ArrowLeft,
  Mail,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { customerInfoFormSchema } from "../../../utils/customer-info-form-schema";
import { useMutation } from "@tanstack/react-query";
import {
  addBooking,
  resendConfirmationCode,
} from "../../../service/booking-service";
import { toast } from "react-toastify";

// CustomerInfo Component
const CustomerInfo = ({ roomId, onBack, bookingData, onPayment }) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  // Add booking mutation
  const { mutate: addBookingMutation, isPending: addBookingPending } =
    useMutation({
      mutationFn: addBooking,
      onSuccess: ({ data }) => {
        if (data.status === 201) {
          toast.success("Email with confirmation code has been sent to you");
        } else {
          toast.error("Failed to send confirmation code to your email");
        }
        setIsCodeSent(true);
        setCodeTimer(60);
      },
      onError: (err) => {
        toast.error("Failed to add booking," + err.message);
        setIsCodeSent(true);
        setCodeTimer(60);
      },
    });

  const {
    mutate: resentConfirmationCodeMutation,
    isPending: resentConfirmationCodeMutationPending,
  } = useMutation({
    mutationFn: resendConfirmationCode,
    onSuccess: ({ data }) => {
      if (data.status === 200) {
        toast.success("Resend confirmation successfully");
      } else {
        toast.error("Failed to resend confirmation code");
      }
      setCodeTimer(60);
    },
    onError: (err) => {
      toast.error("Failed to resend confirmation code," + err.message);
      setCodeTimer(60);
    },
  });

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    resolver: yupResolver(customerInfoFormSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      fullName: "",
      email: "",
      tel: "",
      confirmationCode: "",
    },
  });

  // Watch email field for send code functionality
  const watchedEmail = watch("email");

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (codeTimer > 0) {
      interval = setInterval(() => {
        setCodeTimer(codeTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeTimer]);

  // Send confirmation code
  const handleSendCode = async () => {
    // Validate email field before sending code
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    const data = {
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      fullName: getValues("fullName"),
      email: getValues("email"),
      tel: getValues("tel"),
      totalPrice: parseFloat(bookingData.totalAmount),
      numOfGuest: parseInt(bookingData.guests),
      roomId: roomId,
    };

    if (!isCodeSent) {
      addBookingMutation(data);
      return;
    } else {
      resentConfirmationCodeMutation(roomId, data);
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (!isCodeSent) {
      // This shouldn't happen with proper validation, but keeping as safety check
      return;
    }

    const paymentData = {
      customerInfo: data,
      bookingInfo: {
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalAmount: bookingData.totalAmount,
        numberOfNights: bookingData.numberOfNights,
        roomId: roomId,
      },
      pricing: bookingData.pricing,
    };

    onPayment(paymentData);
  };

  // Check if form is ready for submission
  const isFormReady = isValid && isCodeSent;

  // Check if email is valid for sending code
  const isEmailValidForCode = watchedEmail && !errors.email;

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-xl font-bold text-gray-800">Guest Information</h3>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-sm text-gray-600 mb-2">
          {new Date(bookingData.checkIn).toLocaleDateString()} -{" "}
          {new Date(bookingData.checkOut).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {bookingData.numberOfNights}{" "}
          {bookingData.numberOfNights === 1 ? "night" : "nights"} •{" "}
          {bookingData.guests} {bookingData.guests === 1 ? "guest" : "guests"}
        </div>
        <div className="text-lg font-bold text-gray-800">
          Total: {formatPriceUSD(bookingData.totalAmount)}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <input
              {...register("fullName")}
              type="text"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.fullName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your email address"
            />
            <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <input
              {...register("tel")}
              type="tel"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.tel ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            <Phone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.tel && (
            <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>
          )}
        </div>

        {/* Confirmation Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Confirmation Code *
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                {...register("confirmationCode")}
                type="text"
                className={`flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.confirmationCode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter 6-digit code"
                maxLength="6"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setValue("confirmationCode", value);
                }}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={
                  addBookingPending ||
                  resentConfirmationCodeMutationPending ||
                  codeTimer > 0 ||
                  !isEmailValidForCode
                }
                className={`px-4 py-3 rounded-xl font-medium text-sm transition ${
                  addBookingPending ||
                  resentConfirmationCodeMutationPending ||
                  codeTimer > 0 ||
                  !isEmailValidForCode
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {addBookingPending || resentConfirmationCodeMutationPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : codeTimer > 0 ? (
                  `${codeTimer}s`
                ) : (
                  "Send Code"
                )}
              </button>
            </div>

            {isCodeSent && !addBookingPending && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">
                  Confirmation code sent to {watchedEmail}
                </span>
              </div>
            )}

            {errors.confirmationCode && (
              <p className="text-red-500 text-sm">
                {errors.confirmationCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={!isFormReady}
          className={`w-full font-bold py-4 px-6 rounded-xl mt-6 transition-opacity ${
            isFormReady
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Choose Payment Method
        </button>
      </form>

      {/* Security Note */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Your information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default CustomerInfo;
