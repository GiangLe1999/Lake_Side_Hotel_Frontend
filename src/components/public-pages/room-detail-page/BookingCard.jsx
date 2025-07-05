import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Shield,
  Star,
  Users,
  AlertCircle,
} from "lucide-react";
import formatPriceUSD from "../../../utils/format-price";
import priceInfoConstants from "../../../constants/price-info";
import CustomerInfo from "./CustomerInfo";

// Mock format price function
const BookingCard = ({ roomData }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [dateError, setDateError] = useState("");
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Get current date for min date
  const today = new Date().toISOString().split("T")[0];

  // Calculate number of nights
  const calculateNights = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return 0;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Validate dates
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

  // Effect to validate and calculate nights when dates change
  useEffect(() => {
    const isValid = validateDates(checkIn, checkOut);
    if (isValid && checkIn && checkOut) {
      const nights = calculateNights(checkIn, checkOut);
      setNumberOfNights(nights);
    } else {
      setNumberOfNights(0);
    }
  }, [checkIn, checkOut]);

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

  // Calculate pricing
  const roomTotal = roomData?.price * numberOfNights;
  const serviceFee = priceInfoConstants.serviceFee;
  const taxes = Math.round(roomTotal * priceInfoConstants.taxes);
  const totalAmount = roomTotal + serviceFee + taxes;

  // Check if can book
  const canBook = checkIn && checkOut && !dateError && numberOfNights > 0;

  // Prepare booking data for CustomerInfo component
  const bookingData = {
    roomName: roomData?.name,
    checkIn,
    checkOut,
    guests,
    numberOfNights,
    totalAmount,
  };

  if (showForm) {
    return (
      <CustomerInfo
        roomId={roomData.id}
        onBack={() => setShowForm(false)}
        bookingData={bookingData}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8 sticky top-[163px]">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {formatPriceUSD(roomData?.price)}
          </span>
          <span className="text-gray-500">/ night</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="font-semibold">
            {roomData?.avgRating?.toFixed(2)}
          </span>
          <span>({roomData?.reviewCount} reviews)</span>
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
                className={`main-input ${dateError ? "border-red-300" : ""}`}
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
                className={`main-input ${dateError ? "border-red-300" : ""}`}
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

        {/* Display number of nights */}
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
              className="main-input appearance-none"
            >
              {Array.from(
                { length: roomData?.occupancy || 1 },
                (_, i) => i + 1
              )?.map((num) => (
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
              {formatPriceUSD(roomData?.price)} × {numberOfNights}{" "}
              {numberOfNights === 1 ? "night" : "nights"}
            </span>
            <span className="font-semibold">{formatPriceUSD(roomTotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Service fee</span>
            <span className="font-semibold">{formatPriceUSD(serviceFee)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm">Taxes (10%)</span>
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
          canBook ? "main-btn" : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
