import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Phone, Shield, ArrowLeft, Mail, User } from "lucide-react";
import useCountdownTimer from "../../../../hooks/useCountdownTimer";
import useBookingMutations from "../../../../hooks/useBookingMutations";
import { customerInfoFormSchema } from "../../../../utils/customer-info-form-schema";
import { Loading } from "../../../common/Loading";
import BookingSummary from "./BookingSumary";
import FormInput from "./FormInput";
import ConfirmationCodeSection from "./ConfirmationCodeSection";
import ChoosePayment from "../ChoosePayment";
import { useAuth } from "../../../../hooks/useAuth";

const CustomerInfo = ({ roomId, onBack, bookingData }) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [codeTimer, startTimer] = useCountdownTimer();
  const { user } = useAuth();

  // Initialize React Hook Form
  const form = useForm({
    resolver: yupResolver(customerInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      tel: "",
      confirmationCode: "",
    },
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    getValues,
  } = form;

  const watchedFullName = watch("fullName");
  const watchedEmail = watch("email");
  const watchedTel = watch("tel");
  const watchedConfirmationCode = watch("confirmationCode");

  // Trigger validation cho default values
  useEffect(() => {
    // Trigger validation cho các trường có default values
    if (user?.fullName || user?.email) {
      trigger(["fullName", "email"]);
    }
  }, [user, trigger]);

  // Check validation state chi tiết hơn
  const isManualValid = useMemo(() => {
    const values = getValues();
    return (
      values.fullName?.trim() &&
      values.email?.trim() &&
      values.tel?.trim() &&
      !errors.fullName &&
      !errors.email &&
      !errors.tel &&
      (!isCodeSent ||
        (isCodeSent &&
          values.confirmationCode?.length === 6 &&
          !errors.confirmationCode))
    );
  }, [
    getValues,
    errors,
    isCodeSent,
    watchedFullName,
    watchedEmail,
    watchedTel,
    watchedConfirmationCode,
  ]);

  // Custom hooks with success callback
  const {
    addBookingMutation,
    resendConfirmationCodeMutation,
    confirmBookingMutation,
  } = useBookingMutations(
    setBookingId,
    setIsCodeSent,
    startTimer,
    // Success callback for confirmation
    () => {
      setShowPaymentSelection(true);
    }
  );

  // Memoized values - SỬ DỤNG VALIDATION TỰ TẠO
  const isFormReady = useMemo(() => {
    return isManualValid && isCodeSent && watchedConfirmationCode.length === 6;
  }, [isManualValid, isCodeSent, watchedConfirmationCode]);

  const isValidForCode = useMemo(() => {
    return (
      watchedEmail?.trim() &&
      !errors.email &&
      watchedFullName?.trim() &&
      !errors.fullName &&
      watchedTel?.trim() &&
      !errors.tel
    );
  }, [
    watchedEmail,
    errors.email,
    watchedFullName,
    errors.fullName,
    watchedTel,
    errors.tel,
  ]);

  const isLoadingCode = useMemo(
    () =>
      addBookingMutation.isPending || resendConfirmationCodeMutation.isPending,
    [addBookingMutation.isPending, resendConfirmationCodeMutation.isPending]
  );

  // Handlers
  const handleSendCode = useCallback(async () => {
    // TRIGGER VALIDATION CHO TẤT CẢ CÁC TRƯỜNG TRƯỚC KHI GỬI
    const isFormValidForSending = await trigger(["fullName", "email", "tel"]);
    if (!isFormValidForSending) return;

    const bookingFormData = {
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      fullName: getValues("fullName"),
      email: getValues("email"),
      tel: getValues("tel"),
      totalPrice: parseFloat(bookingData.totalAmount),
      numOfGuest: parseInt(bookingData.guests),
      roomId: roomId,
    };

    if (!isCodeSent && !bookingId) {
      addBookingMutation.mutate(bookingFormData);
    } else {
      resendConfirmationCodeMutation.mutate({
        bookingId,
        data: bookingFormData,
      });
    }
  }, [
    trigger,
    bookingData,
    getValues,
    roomId,
    isCodeSent,
    bookingId,
    addBookingMutation,
    resendConfirmationCodeMutation,
  ]);

  const onSubmit = useCallback(
    (data) => {
      if (!isCodeSent) return;

      confirmBookingMutation.mutate({
        bookingId,
        confirmationCode: data.confirmationCode,
      });
    },
    [isCodeSent, bookingId, confirmBookingMutation]
  );

  const handleBackToBooking = useCallback(() => {
    if (showPaymentSelection) {
      setShowPaymentSelection(false);
    } else {
      onBack();
    }
  }, [showPaymentSelection, onBack]);

  // Render ChoosePayment component if payment selection is active
  if (showPaymentSelection) {
    return (
      <ChoosePayment
        bookingId={bookingId}
        bookingData={bookingData}
        customerInfo={{
          name: watchedFullName,
          email: watchedEmail,
          tel: watchedTel,
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-[163px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBackToBooking}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-xl font-bold text-gray-800">Guest Information</h3>
      </div>

      {/* Booking Summary */}
      <BookingSummary bookingData={bookingData} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          register={register}
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          Icon={User}
          error={errors.fullName}
          disabled={isCodeSent}
        />

        <FormInput
          register={register}
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          Icon={Mail}
          error={errors.email}
          disabled={isCodeSent}
        />

        <FormInput
          register={register}
          name="tel"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          Icon={Phone}
          error={errors.tel}
          disabled={isCodeSent}
        />

        <ConfirmationCodeSection
          register={register}
          setValue={setValue}
          errors={errors}
          watchedEmail={watchedEmail}
          isCodeSent={isCodeSent}
          codeTimer={codeTimer}
          isValidForCode={isValidForCode}
          isLoading={isLoadingCode}
          onSendCode={handleSendCode}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormReady || confirmBookingMutation.isPending}
          className={`w-full font-bold py-4 px-6 rounded-xl mt-6 transition-opacity ${
            isFormReady
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {confirmBookingMutation.isPending ? (
            <Loading />
          ) : (
            "Choose Payment Method"
          )}
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
