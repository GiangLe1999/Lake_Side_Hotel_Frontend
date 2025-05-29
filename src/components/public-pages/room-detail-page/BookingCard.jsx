import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Shield,
  Star,
  Users,
  AlertCircle,
  ArrowLeft,
  Mail,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Mock format price function
const formatPriceUSD = (price) => `$${price.toLocaleString()}`;

const roomData = {
  id: 1,
  type: "Deluxe Ocean View Suite",
  description:
    "Experience luxury living with panoramic ocean views from our premium suite featuring modern amenities and elegant design.",
  price: 299,
  area: 45,
  beds: 2,
  rating: 4.8,
  reviewCount: 124,
  images: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
  ],
  features: [
    "Ocean view balcony",
    "Marble bathroom with rainfall shower",
    "Mini refrigerator and minibar",
    "24/7 concierge service",
    "Complimentary breakfast",
    "Daily housekeeping",
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
        "Absolutely stunning room with incredible ocean views. The service was exceptional and the amenities were top-notch.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "1 week ago",
      comment:
        "Perfect for our honeymoon! The room was spacious, clean, and the bed was so comfortable. Highly recommend!",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      date: "2 weeks ago",
      comment:
        "Great location and beautiful room. The only minor issue was the wifi speed, but everything else was perfect.",
    },
  ],
};

const BookingCard = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [dateError, setDateError] = useState("");
  const [numberOfNights, setNumberOfNights] = useState(0);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    tel: "",
    confirmationCode: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  // Lấy ngày hiện tại để đặt min date
  const today = new Date().toISOString().split("T")[0];

  // Hàm tính số đêm
  const calculateNights = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return 0;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Hàm kiểm tra và validate ngày
  const validateDates = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) {
      setDateError("");
      return true;
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (start < currentDate) {
      setDateError("Check-in date cannot be in the past");
      return false;
    }

    if (end <= start) {
      setDateError("Check-out date must be after the check-in date");
      return false;
    }

    setDateError("");
    return true;
  };

  // Effect để validate và tính số đêm khi ngày thay đổi
  useEffect(() => {
    const isValid = validateDates(checkIn, checkOut);
    if (isValid && checkIn && checkOut) {
      const nights = calculateNights(checkIn, checkOut);
      setNumberOfNights(nights);
    } else {
      setNumberOfNights(0);
    }
  }, [checkIn, checkOut]);

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

  // Handle check-in date change
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);

    if (checkOut && new Date(checkOut) <= new Date(newCheckIn)) {
      setCheckOut("");
    }
  };

  // Handle check-out date change
  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    setCheckOut(newCheckOut);
  };

  // Handle customer info change
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!customerInfo.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!customerInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = "Invalid email format";
    }

    if (!customerInfo.tel.trim()) {
      errors.tel = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(customerInfo.tel)) {
      errors.tel = "Invalid phone number format";
    }

    if (!customerInfo.confirmationCode.trim()) {
      errors.confirmationCode = "Confirmation code is required";
    } else if (customerInfo.confirmationCode.length !== 6) {
      errors.confirmationCode = "Confirmation code must be 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Send confirmation code
  const handleSendCode = async () => {
    if (!customerInfo.email.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Please enter email first",
      }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
      return;
    }

    setIsSendingCode(true);

    // Simulate API call
    setTimeout(() => {
      setIsSendingCode(false);
      setIsCodeSent(true);
      setCodeTimer(60); // 60 seconds countdown

      // In real app, you would call your API here
      console.log("Sending confirmation code to:", customerInfo.email);
    }, 2000);
  };

  // Handle payment with PayOS
  const handlePayment = () => {
    if (!validateForm()) {
      return;
    }

    // In real app, integrate with PayOS here
    const paymentData = {
      customerInfo,
      bookingInfo: {
        checkIn,
        checkOut,
        guests,
        numberOfNights,
        roomId: roomData.id,
        roomType: roomData.type,
      },
      pricing: {
        roomTotal: roomData.price * numberOfNights,
        serviceFee: 29,
        taxes: Math.round(roomData.price * numberOfNights * 0.12),
        totalAmount:
          roomData.price * numberOfNights +
          29 +
          Math.round(roomData.price * numberOfNights * 0.12),
      },
    };

    console.log("Processing payment with PayOS:", paymentData);
    alert("Redirecting to PayOS payment gateway...");
  };

  // Tính tổng tiền
  const roomTotal = roomData.price * numberOfNights;
  const serviceFee = 29;
  const taxes = Math.round(roomTotal * 0.12);
  const totalAmount = roomTotal + serviceFee + taxes;

  // Kiểm tra có thể đặt phòng hay không
  const canBook = checkIn && checkOut && !dateError && numberOfNights > 0;

  if (showForm) {
    return (
      <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-xl font-bold text-gray-800">Guest Information</h3>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">
            {new Date(checkIn).toLocaleDateString()} -{" "}
            {new Date(checkOut).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {numberOfNights} {numberOfNights === 1 ? "night" : "nights"} •{" "}
            {guests} {guests === 1 ? "guest" : "guests"}
          </div>
          <div className="text-lg font-bold text-gray-800">
            Total: {formatPriceUSD(totalAmount)}
          </div>
        </div>

        {/* Customer Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerInfo.fullName}
                onChange={(e) =>
                  handleCustomerInfoChange("fullName", e.target.value)
                }
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  formErrors.fullName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              <User className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {formErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  handleCustomerInfoChange("email", e.target.value)
                }
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  formErrors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
              />
              <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={customerInfo.tel}
                onChange={(e) =>
                  handleCustomerInfoChange("tel", e.target.value)
                }
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  formErrors.tel ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your phone number"
              />
              <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {formErrors.tel && (
              <p className="text-red-500 text-sm mt-1">{formErrors.tel}</p>
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
                  type="text"
                  value={customerInfo.confirmationCode}
                  onChange={(e) =>
                    handleCustomerInfoChange(
                      "confirmationCode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className={`flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    formErrors.confirmationCode
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
                <button
                  onClick={handleSendCode}
                  disabled={isSendingCode || codeTimer > 0}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                    isSendingCode || codeTimer > 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {isSendingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : codeTimer > 0 ? (
                    `${codeTimer}s`
                  ) : (
                    "Send Code"
                  )}
                </button>
              </div>

              {isCodeSent && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700">
                    Confirmation code sent to {customerInfo.email}
                  </span>
                </div>
              )}

              {formErrors.confirmationCode && (
                <p className="text-red-500 text-sm">
                  {formErrors.confirmationCode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-opacity mt-6"
        >
          Proceed to Payment
        </button>

        {/* Security Note */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Your information is secure and encrypted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {formatPriceUSD(roomData.price)}
          </span>
          <span className="text-gray-500">/ night</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="font-semibold">{roomData.rating}</span>
          <span>({roomData.reviewCount} reviews)</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Check-in/Check-out */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={handleCheckInChange}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  dateError ? "border-red-300" : "border-gray-300"
                }`}
              />
              <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={handleCheckOutChange}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  dateError ? "border-red-300" : "border-gray-300"
                }`}
              />
              <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {dateError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600">{dateError}</span>
          </div>
        )}

        {/* Hiển thị số đêm */}
        {numberOfNights > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
            <span className="text-sm text-green-700 font-medium">
              {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}{" "}
              selected
            </span>
          </div>
        )}

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <div className="relative">
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
            <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {numberOfNights > 0 && (
        <div className="border-t border-gray-200 pt-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">
              {formatPriceUSD(roomData.price)} × {numberOfNights}{" "}
              {numberOfNights === 1 ? "night" : "nights"}
            </span>
            <span className="font-semibold">{formatPriceUSD(roomTotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Service fee</span>
            <span className="font-semibold">{formatPriceUSD(serviceFee)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Taxes (12%)</span>
            <span className="font-semibold">{formatPriceUSD(taxes)}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-lg font-bold text-gray-800">
                {formatPriceUSD(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        disabled={!canBook}
        onClick={() => canBook && setShowForm(true)}
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 ${
          canBook
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {canBook ? "Reserve Now" : "Select Dates to Continue"}
      </button>

      {/* Security Note */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>Need help? Call us at +1 (555) 123-4567</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
          <Clock className="w-4 h-4" />
          <span>24/7 customer support available</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
