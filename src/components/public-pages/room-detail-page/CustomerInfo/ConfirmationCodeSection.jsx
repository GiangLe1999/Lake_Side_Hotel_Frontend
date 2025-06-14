import { CheckCircle } from "lucide-react";
import { useCallback } from "react";
import { Loading } from "../../../common/Loading";

const CODE_MAX_LENGTH = 6;

const ConfirmationCodeSection = ({
  register,
  setValue,
  errors,
  watchedEmail,
  isCodeSent,
  codeTimer,
  isValidForCode,
  isLoading,
  onSendCode,
}) => {
  const handleCodeChange = useCallback(
    async (e) => {
      const value = e.target.value
        .replace(/[^A-Za-z0-9 ]/g, "")
        .slice(0, CODE_MAX_LENGTH);
      setValue("confirmationCode", value);
    },
    [setValue]
  );

  const isButtonDisabled = isLoading || codeTimer > 0 || !isValidForCode;

  const getButtonText = () => {
    if (isLoading) return <Loading className="w-4 h-4 animate-spin" />;
    if (codeTimer > 0) return `Resend in ${codeTimer}s`;
    if (isCodeSent) return "Resend Code";
    return "Send Code";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Confirmation Code *
      </label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            {...register("confirmationCode")}
            type="text"
            className={`flex-1 p-3 main-input ${
              errors.confirmationCode ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter 6-character code"
            maxLength={CODE_MAX_LENGTH}
            onChange={handleCodeChange}
          />
          <button
            type="button"
            onClick={onSendCode}
            disabled={isButtonDisabled}
            className={`px-4 py-3 rounded-xl font-medium text-sm transition ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700 transition duration-500"
            }`}
          >
            {getButtonText()}
          </button>
        </div>

        {isCodeSent && !isLoading && (
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
  );
};

export default ConfirmationCodeSection;
