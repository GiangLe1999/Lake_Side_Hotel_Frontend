import React, { useMemo } from "react";
import formatPriceUSD from "../../../../utils/format-price";

const BookingSumary = ({ bookingData }) => {
  const formattedCheckIn = useMemo(
    () => new Date(bookingData.checkIn).toLocaleDateString(),
    [bookingData.checkIn]
  );

  const formattedCheckOut = useMemo(
    () => new Date(bookingData.checkOut).toLocaleDateString(),
    [bookingData.checkOut]
  );

  const nightText = bookingData.numberOfNights === 1 ? "night" : "nights";
  const guestText = bookingData.guests === 1 ? "guest" : "guests";

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <div className="text-sm text-gray-600 mb-2">
        {formattedCheckIn} - {formattedCheckOut}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        {bookingData.numberOfNights} {nightText} for {bookingData.guests}{" "}
        {guestText}
      </div>
      <div className="font-bold text-gray-800 pt-4 border-t border-gray-200">
        Total: {formatPriceUSD(bookingData.totalAmount)}
      </div>
    </div>
  );
};

export default BookingSumary;
