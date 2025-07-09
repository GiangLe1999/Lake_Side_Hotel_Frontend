import React, { useState, useMemo } from "react";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  CreditCard,
  Clock,
  Check,
  X,
  AlertCircle,
  Eye,
  Download,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import {
  cancelUserBooking,
  getUserBookings,
} from "../../service/booking-service";
import { Link } from "react-router-dom";
import formatDate from "../../utils/format-date";
import formatPriceUSD from "../../utils/format-price";
import { getPublicS3Url } from "../../utils/get-s3-url";
import Modal from "react-modal";
import { calculateNights } from "../../utils/calculate-nights";
import { generatePDFReceipt } from "../../utils/generate-pdf-receipt";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { toast } from "react-toastify";

const MyBookingsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [canceledBooking, setCanceledBooking] = useState(null);

  const { user } = useAuth();

  // Simulate API call
  const {
    data: bookings,
    isLoading: getBookingsLoading,
    error: getBookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["userBookings", user.id],
    queryFn: getUserBookings,
  });

  const {
    mutate: cancelUserBookingMutation,
    isPending: cancelUserBookingPending,
  } = useMutation({
    mutationFn: cancelUserBooking,
    onSuccess: (response) => {
      if (response === "success" || response === "success and refund") {
        refetchBookings();
        if (response == "success") {
          setCanceledBooking(null);
          toast.success(`Cancel booking successfully`);
        } else if (response == "success and refund") {
          setCanceledBooking(null);
          toast.success(
            `Your booking has been successfully canceled. You will receive your refund within 5–10 business days.`
          );
        } else if (response == "failed") {
          toast.error(`Failed to cancel booking`);
        }
      }
    },
    onError: (err) => {
      toast.error("Failed to cancel booking: " + err.message);
    },
  });

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      const matchesStatus =
        selectedStatus === "ALL" || booking.bookingStatus === selectedStatus;
      const matchesPaymentStatus =
        selectedPaymentStatus === "ALL" ||
        booking.paymentStatus === selectedPaymentStatus;
      const matchesSearch =
        booking?.confirmationCode
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ||
        booking?.guestFullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking?.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking?.room?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPaymentStatus && matchesSearch;
    });
  }, [bookings, selectedStatus, selectedPaymentStatus, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "CHECKED_OUT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CHECKED_IN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <Check className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <X className="w-4 h-4" />;
      case "CHECKED_OUT":
        return <Check className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (getBookingsLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (getBookingsError) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600">
              Unable to load bookings. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = (booking) => {
    const now = new Date();
    const checkInTime = new Date(booking?.checkInDate);

    const diffInMs = checkInTime?.getTime() - now?.getTime();
    const hoursBeforeCheckIn = diffInMs / (1000 * 60 * 60);

    const validBookingStatus =
      booking?.bookingStatus === "PENDING" ||
      booking?.bookingStatus === "CONFIRMED";

    const validPaymentStatus =
      booking?.paymentStatus !== "FAILED" &&
      booking?.paymentStatus !== "REFUNDED";

    const validTime = hoursBeforeCheckIn >= 12;

    const canCancel = validBookingStatus && validPaymentStatus && validTime;

    let message = "";

    if (!validBookingStatus) {
      message = "Only pending or confirmed bookings can be canceled.";
    } else if (!validPaymentStatus) {
      message = "Bookings with failed or refunded payments cannot be canceled.";
    } else if (!validTime) {
      const hours = Math.floor(hoursBeforeCheckIn);
      message = `Cancellations must be made at least 12 hours before check-in. ${
        hours > 0
          ? `Only ${hours} hour(s) remaining`
          : `Check-in time was ${Math.abs(hours)} hour(s) ago`
      } `;
    }

    return {
      canCancel,
      message,
    };
  };

  return (
    <div className="min-h-screen bg-white py-14">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage and track all your hotel reservations in one place
            </p>
            <p className="text-sm text-red-500 mt-2 italic">
              * Please note: Bookings cannot be canceled within 24 hours of the
              check-in time.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Confirmation code, name, email, ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 main-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 main-input"
                >
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="CHECKED_OUT">Checked Out</option>
                  <option value="CHECKED_IN">Checked In</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 main-input"
                >
                  <option value="ALL">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    setSelectedStatus("ALL");
                    setSelectedPaymentStatus("ALL");
                    setSearchTerm("");
                  }}
                  className="px-4 h-[49px] mt-auto mb-[3px] main-btn w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                No reservations match your current filters.
              </p>
              <Link
                to="/room-listing"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-sm"
              >
                Make a Reservation
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking?.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Booking Header */}
                <div className="bg-white p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-yellow-600">
                        #{booking?.id} - {booking?.confirmationCode}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatDate(booking?.checkInDate, "dd/MM/yyyy")} -{" "}
                            {formatDate(booking?.checkOutDate, "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {calculateNights(
                              booking?.checkInDate,
                              booking?.checkOutDate
                            )}{" "}
                            nights
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1 border ${getStatusColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {getStatusIcon(booking?.bookingStatus || "PENDING")}
                        {booking?.bookingStatus || "PENDING"}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium border ${getPaymentStatusColor(
                          booking?.paymentStatus || "PENDING"
                        )}`}
                      >
                        {booking?.paymentStatus || "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Room Info */}
                    <div className="lg:col-span-2">
                      <div className="flex gap-4 mb-4">
                        <img
                          src={getPublicS3Url(
                            booking?.room?.thumbnailKey || ""
                          )}
                          alt={booking?.room?.name + booking?.id}
                          className="w-24 h-20 object-cover rounded-xl border border-gray-200"
                        />
                        <div>
                          <Link to={`/room/${booking?.room?.id}`}>
                            <h4 className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors duration-500 mb-1">
                              {booking?.room?.name}
                            </h4>
                          </Link>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {booking?.room?.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{booking?.numOfGuest} guests</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Guest Info */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-3">
                          Guest Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{booking?.guestFullName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{booking?.guestEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{booking?.guestTel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>{booking?.paymentType || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <h5 className="font-medium text-gray-900 mb-3">
                        Price Summary
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>
                            Room (
                            {calculateNights(
                              booking?.checkInDate,
                              booking?.checkOutDate
                            )}{" "}
                            nights)
                          </span>
                          <span>{formatPriceUSD(booking.totalPrice)}</span>
                        </div>
                        <div className="border-t border-amber-200 pt-2">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span className="text-orange-600">
                              {formatPriceUSD(booking.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-2 border-gray-100">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="main-btn gap-2 px-4 py-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {booking.paymentStatus === "PAID" && (
                      <button
                        onClick={() => generatePDFReceipt(booking)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>
                    )}

                    {booking.bookingStatus === "CHECKED_OUT" && (
                      <Link
                        to={`/room/${booking?.room?.id}`}
                        className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-200"
                      >
                        <Star className="w-4 h-4" />
                        Write Review
                      </Link>
                    )}

                    {booking.bookingStatus === "CANCELLED" ? (
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-white bg-red-300 rounded-xl cursor-not-allowed"
                        disabled
                      >
                        <X className="w-4 h-4" />
                        Cancelled
                      </button>
                    ) : (
                      <button
                        className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200 ${
                          canCancel(booking).canCancel
                            ? "border-rose-300 text-rose-700 hover:bg-rose-50"
                            : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
                        }`}
                        disabled={!canCancel(booking).canCancel}
                        data-tooltip-id={`cancel-tooltip-${booking.id}`}
                        data-tooltip-content={canCancel(booking).message}
                        onClick={() => setCanceledBooking(booking)}
                      >
                        <X className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}

                    <ReactTooltip
                      id={`cancel-tooltip-${booking.id}`}
                      place="top"
                      effect="solid"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <Modal
            isOpen={selectedBooking !== null}
            contentLabel="Booking Details Modal"
            className="payment-modal"
            overlayClassName="payment-modal-overlay"
          >
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mt-2">
                    Booking Details
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Confirmation Code:</span>
                      <p className="font-semibold">
                        {selectedBooking?.confirmationCode}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Booking Date:</span>
                      <p className="font-semibold">
                        {formatDate(selectedBooking?.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-in:</span>
                      <p className="font-semibold">
                        {formatDate(selectedBooking?.checkInDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-out:</span>
                      <p className="font-semibold">
                        {formatDate(selectedBooking?.checkOutDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Room Type:</span>
                      <p className="font-semibold">
                        {selectedBooking?.room?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Guests:</span>
                      <p className="font-semibold">
                        {selectedBooking?.numOfGuest} guests
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Full Name:</span>{" "}
                        {selectedBooking?.guestFullName}
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>{" "}
                        {selectedBooking?.guestEmail}
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>{" "}
                        {selectedBooking?.guestTel}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="font-medium mb-3">Payment Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Payment Method:</span>{" "}
                        {selectedBooking?.paymentType || "PENDING"}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getPaymentStatusColor(
                            selectedBooking?.paymentStatus || "PENDING"
                          )}`}
                        >
                          {selectedBooking?.paymentStatus || "PENDING"}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-orange-600 ml-2">
                          {formatPriceUSD(selectedBooking?.totalPrice)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Cancel Confirmation Modal */}
        {canceledBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cancel Booking
                    </h3>
                    <p className="text-sm text-gray-600">
                      Confirmation Code: {canceledBooking.confirmationCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Booking Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Room: {canceledBooking.room.name}</p>
                      <p>
                        Dates: {formatDate(canceledBooking.checkInDate)} -{" "}
                        {formatDate(canceledBooking.checkOutDate)}
                      </p>
                      <p>
                        Total Amount:{" "}
                        {formatPriceUSD(canceledBooking.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {canceledBooking.paymentStatus === "PAID" && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <RefreshCw className="w-5 h-5 text-blue-800 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">
                            Refund Information
                          </h4>
                          <p className="text-xs text-blue-500">
                            <strong>Stripe Policy:</strong> Refunds are
                            processed immediately but may take up to 10 business
                            days to appear on your statement, depending on your
                            bank or card issuer.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                    <p className="text-sm text-rose-700">
                      <strong>Warning:</strong> This action cannot be undone.
                      Once cancelled, you will need to make a new booking if you
                      wish to reserve this room again.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCanceledBooking(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={false}
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => {
                      cancelUserBookingMutation(canceledBooking.id);
                    }}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                    disabled={false}
                  >
                    {cancelUserBookingPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Canceling...
                      </>
                    ) : (
                      "Cancel Booking"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
