import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Globe,
  Calendar,
  MessageCircle,
  User,
  Star,
  Award,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  Sparkles,
  ArrowRight,
  Building,
  Users,
  Heart,
  Shield,
} from "lucide-react";

// Validation schema
const contactSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: yup
    .string()
    .required("Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[+]?[\d\s-()]+$/, "Số điện thoại không hợp lệ"),
  subject: yup.string().required("Chủ đề là bắt buộc"),
  inquiryType: yup.string().required("Vui lòng chọn loại yêu cầu"),
  message: yup
    .string()
    .required("Tin nhắn là bắt buộc")
    .min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
  checkIn: yup.string().when("inquiryType", {
    is: "reservation",
    then: () => yup.string().required("Ngày nhận phòng là bắt buộc"),
    otherwise: () => yup.string(),
  }),
  checkOut: yup.string().when("inquiryType", {
    is: "reservation",
    then: () => yup.string().required("Ngày trả phòng là bắt buộc"),
    otherwise: () => yup.string(),
  }),
  guests: yup.number().when("inquiryType", {
    is: "reservation",
    then: () =>
      yup
        .number()
        .required("Số khách là bắt buộc")
        .min(1, "Ít nhất 1 khách")
        .max(20, "Tối đa 20 khách"),
    otherwise: () => yup.number(),
  }),
});

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      inquiryType: "general",
      guests: 2,
    },
  });

  const inquiryType = watch("inquiryType");

  const inquiryTypes = [
    { value: "general", label: "Thông tin chung", icon: MessageCircle },
    { value: "reservation", label: "Đặt phòng", icon: Calendar },
    { value: "event", label: "Sự kiện & Hội nghị", icon: Users },
    { value: "wedding", label: "Đám cưới", icon: Heart },
    { value: "spa", label: "Spa & Wellness", icon: Sparkles },
    { value: "dining", label: "Nhà hàng", icon: Utensils },
    { value: "concierge", label: "Dịch vụ Concierge", icon: User },
    { value: "feedback", label: "Phản hồi", icon: Star },
  ];

  const locations = [
    {
      name: "LuxuryStay Hà Nội",
      address: "45 Hoàn Kiếm, Hà Nội, Việt Nam",
      phone: "+84 24 3936 0888",
      email: "hanoi@luxurystay.com",
      hours: "24/7 Concierge Service",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      features: [
        "Phòng tổng thống",
        "Spa 5 sao",
        "3 nhà hàng",
        "Bể bơi vô cực",
      ],
    },
    {
      name: "LuxuryStay Hồ Chí Minh",
      address: "88 Đồng Khởi, Q.1, TP.HCM, Việt Nam",
      phone: "+84 28 3829 2888",
      email: "hcmc@luxurystay.com",
      hours: "24/7 Concierge Service",
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
      features: [
        "Sky Bar",
        "Fitness Center",
        "Business Center",
        "Valet Parking",
      ],
    },
    {
      name: "LuxuryStay Đà Nẵng",
      address: "123 Bạch Đằng, Hải Châu, Đà Nẵng, Việt Nam",
      phone: "+84 236 3888 999",
      email: "danang@luxurystay.com",
      hours: "24/7 Concierge Service",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      features: ["Beachfront", "Water Sports", "Kids Club", "Ocean View"],
    },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form data:", data);
    setIsLoading(false);
    setIsSubmitted(true);
    reset();
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop')",
          }}
        ></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white/20">
            <MessageCircle className="w-5 h-5 text-yellow-400" />
            Liên hệ với chúng tôi
          </div>

          <h1 className="font-bold mb-6 animate-fade-in tangerine-bold">
            <span className="text-6xl md:text-8xl bg-gradient-to-r from-white via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Connect
            </span>
            <span className="text-4xl md:text-6xl block text-white drop-shadow-2xl">
              with LuxuryStay
            </span>
          </h1>

          <p className="text-xl text-gray-100 leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy để chúng
            tôi biết làm thế nào để tạo ra trải nghiệm hoàn hảo cho bạn.
          </p>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Hotline 24/7</h3>
              <p className="text-blue-600 font-medium">1900 888 999</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-green-600 font-medium">info@luxurystay.com</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Giờ phục vụ</h3>
              <p className="text-purple-600 font-medium">24/7 Concierge</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Cam kết</h3>
              <p className="text-orange-600 font-medium">Phản hồi trong 1h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Send className="w-4 h-4" />
                  Gửi tin nhắn
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Liên hệ với chúng tôi
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn
                  trong thời gian sớm nhất.
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <h3 className="font-bold text-green-800">
                        Gửi thành công!
                      </h3>
                      <p className="text-green-700">
                        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng
                        1 giờ.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên *
                    </label>
                    <input
                      {...register("firstName")}
                      type="text"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="Nhập tên của bạn"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ *
                    </label>
                    <input
                      {...register("lastName")}
                      type="text"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.lastName
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="Nhập họ của bạn"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="+84 123 456 789"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Loại yêu cầu *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type.value}
                        className="relative cursor-pointer group"
                      >
                        <input
                          {...register("inquiryType")}
                          type="radio"
                          value={type.value}
                          className="sr-only"
                        />
                        <div
                          className={`p-3 border-2 rounded-xl text-center transition-all ${
                            inquiryType === type.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-blue-300 text-gray-600"
                          }`}
                        >
                          <type.icon className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-xs font-medium">
                            {type.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.inquiryType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inquiryType.message}
                    </p>
                  )}
                </div>

                {/* Reservation Details */}
                {inquiryType === "reservation" && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Thông tin đặt phòng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày nhận phòng *
                        </label>
                        <input
                          {...register("checkIn")}
                          type="date"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.checkIn
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        {errors.checkIn && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.checkIn.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày trả phòng *
                        </label>
                        <input
                          {...register("checkOut")}
                          type="date"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.checkOut
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                        {errors.checkOut && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.checkOut.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số khách *
                        </label>
                        <select
                          {...register("guests")}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                            errors.guests
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          }`}
                        >
                          {[...Array(20)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} khách
                            </option>
                          ))}
                        </select>
                        {errors.guests && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.guests.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề *
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.subject
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Nhập chủ đề tin nhắn"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Locations */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MapPin className="w-4 h-4" />
                  Địa điểm
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Vị trí các khách sạn
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Chọn địa điểm bạn muốn liên hệ hoặc ghé thăm.
                </p>
              </div>

              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeLocation === index
                        ? "border-blue-300 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-200 hover:shadow-md"
                    }`}
                    onClick={() => setActiveLocation(index)}
                  >
                    <div className="flex gap-4">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {location.name}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {location.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {location.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {location.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {location.hours}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {location.features.map((feature, i) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          activeLocation === index
                            ? "rotate-90 text-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Services Highlight */}
              <div className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Dịch vụ đặc biệt
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">Valet Parking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coffee className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">
                      24h Room Service
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">
                      Fitness Center
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Utensils className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-gray-700">
                      Dining &amp; Bar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
