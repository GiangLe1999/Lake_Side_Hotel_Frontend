import { calculateNights } from "./calculate-nights";
import formatDate from "./format-date";
import formatPriceUSD from "./format-price";
import jsPDF from "jspdf";

export const generatePDFReceipt = (booking) => {
  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

  // Tạo document PDF mới
  const doc = new jsPDF();

  // Cấu hình font và màu sắc
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [52, 73, 94]; // Dark gray
  const lightGray = [149, 165, 166];

  let yPosition = 20;

  // Header - Logo và tiêu đề
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("HOTEL BOOKING RECEIPT", 105, yPosition, { align: "center" });

  // Đường kẻ ngang
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  yPosition += 20;

  // Confirmation Code (nổi bật)
  doc.setFontSize(14);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Confirmation Code:", 20, yPosition);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(booking.confirmationCode, 70, yPosition);

  yPosition += 10;

  // Booking ID
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.setFont("helvetica", "normal");
  doc.text(`Booking ID: ${booking.id}`, 20, yPosition);

  yPosition += 20;

  // Section: Guest Information
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("GUEST INFORMATION", 20, yPosition);

  // Đường kẻ section
  doc.setDrawColor(...primaryColor);
  doc.line(20, yPosition + 2, 100, yPosition + 2);

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");

  const guestInfo = [
    [`Name:`, booking.guestFullName],
    [`Email:`, booking.guestEmail],
    [`Phone:`, booking.guestTel],
  ];

  guestInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 50, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Section: Booking Details
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING DETAILS", 20, yPosition);
  doc.line(20, yPosition + 2, 100, yPosition + 2);

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);

  const bookingDetails = [
    [`Room:`, booking.room.name],
    [`Check-in:`, formatDate(booking.checkInDate)],
    [`Check-out:`, formatDate(booking.checkOutDate)],
    [`Number of Nights:`, nights.toString()],
    [`Number of Guests:`, booking.numOfGuest.toString()],
  ];

  bookingDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Section: Payment Information (với background highlight)
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPosition - 5, 180, 35, "F");

  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT INFORMATION", 20, yPosition);
  doc.line(20, yPosition + 2, 120, yPosition + 2);

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);

  const paymentInfo = [
    [`Payment Method:`, booking.paymentType],
    [`Payment Status:`, booking.paymentStatus],
    [`Total Amount:`, formatPriceUSD(booking.totalPrice)],
  ];

  paymentInfo.forEach(([label, value], index) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPosition);
    doc.setFont("helvetica", "normal");
    if (index === 2) {
      // Total amount - make it stand out
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.setFont("helvetica", "bold");
    }
    doc.text(value, 70, yPosition);
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    yPosition += 8;
  });

  yPosition += 10;

  // Section: Amenities
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("AMENITIES", 20, yPosition);
  doc.line(20, yPosition + 2, 80, yPosition + 2);

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");

  // Chia amenities thành nhiều dòng nếu cần
  const amenitiesText = booking.room.amenities.join(" • ");
  const splitAmenities = doc.splitTextToSize(amenitiesText, 170);
  doc.text(splitAmenities, 20, yPosition);
  yPosition += splitAmenities.length * 6 + 10;

  // Section: Booking Status
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING STATUS", 20, yPosition);
  doc.line(20, yPosition + 2, 95, yPosition + 2);

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);

  const statusInfo = [
    [`Status:`, booking.bookingStatus],
    [`Booking Date:`, formatDate(booking.createdAt)],
  ];

  statusInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 55, yPosition);
    yPosition += 8;
  });

  yPosition += 20;

  // Footer section
  doc.setDrawColor(...lightGray);
  doc.line(20, yPosition, 190, yPosition);

  yPosition += 10;

  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for choosing our hotel!", 105, yPosition, {
    align: "center",
  });

  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");
  doc.text("Contact us: hotel@example.com | (028) 1234 5678", 105, yPosition, {
    align: "center",
  });

  yPosition += 15;

  // Generated timestamp
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text(
    `Generated on: ${new Date().toLocaleString("vi-VN")}`,
    105,
    yPosition,
    { align: "center" }
  );

  // Tải xuống file PDF
  doc.save(`receipt-${booking.confirmationCode}.pdf`);
};
