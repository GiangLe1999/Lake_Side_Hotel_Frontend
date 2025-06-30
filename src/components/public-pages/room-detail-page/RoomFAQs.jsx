import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useChatContext } from "../../../context/ChatContext";

const faqs = [
  {
    id: 1,
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is from 3:00 PM to 11:00 PM, and check-out is before 12:00 PM. Early check-in and late check-out may be available upon request with additional fees.",
    category: "checkin",
    icon: Clock,
  },
  {
    id: 2,
    question: "Is breakfast included in the room rate?",
    answer:
      "Continental breakfast is included for all our premium rooms. Standard rooms can add breakfast for an additional $15 per person per day. Our breakfast is served from 7:00 AM to 10:30 AM.",
    category: "amenities",
    icon: Info,
  },
  {
    id: 3,
    question: "Do you provide airport transportation?",
    answer:
      "Yes, we offer complimentary airport shuttle service. The shuttle runs every 30 minutes during peak hours (6 AM - 10 PM) and hourly during off-peak times. Please inform us of your arrival time at least 2 hours in advance.",
    category: "transport",
    icon: CheckCircle,
  },
  {
    id: 4,
    question: "Is WiFi free in the rooms?",
    answer:
      "Yes, high-speed WiFi is complimentary throughout the hotel, including all guest rooms, lobby, restaurant, and common areas. We also offer premium WiFi for business travelers requiring enhanced bandwidth.",
    category: "amenities",
    icon: CheckCircle,
  },
  {
    id: 5,
    question: "What is your cancellation policy?",
    answer:
      "You can cancel your reservation free of charge up to 24 hours before your scheduled arrival. Cancellations made within 24 hours will incur a charge equal to 50% of the first night's rate. No-show bookings will be charged the full amount.",
    category: "policy",
    icon: AlertCircle,
  },
  {
    id: 6,
    question: "Are pets allowed in the rooms?",
    answer:
      "We welcome small pets (under 25 lbs) with an additional fee of $25 per night. Please inform us in advance if you're traveling with a pet. Service animals are always welcome at no additional charge.",
    category: "policy",
    icon: Info,
  },
  {
    id: 7,
    question: "Do you have parking facilities?",
    answer:
      "Yes, we offer both self-parking ($15/night) and valet parking ($25/night). Electric vehicle charging stations are available in our parking garage at no additional cost for guests.",
    category: "amenities",
    icon: CheckCircle,
  },
  {
    id: 8,
    question: "Can I request extra amenities for my room?",
    answer:
      "Absolutely! We can provide extra pillows, blankets, toiletries, and other amenities upon request. Special occasion setups like flowers, champagne, or birthday decorations can be arranged with advance notice.",
    category: "amenities",
    icon: CheckCircle,
  },
];

const RoomFAQs = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { openChat } = useChatContext();

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "checkin":
        return "text-blue-600";
      case "amenities":
        return "text-green-600";
      case "transport":
        return "text-purple-600";
      case "policy":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryBg = (category) => {
    switch (category) {
      case "checkin":
        return "bg-blue-50";
      case "amenities":
        return "bg-green-50";
      case "transport":
        return "bg-purple-50";
      case "policy":
        return "bg-orange-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
          <HelpCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        {faqs.map((faq) => {
          const IconComponent = faq.icon;
          const isExpanded = expandedFAQ === faq.id;

          return (
            <div
              key={faq.id}
              className={`border border-gray-200 rounded-2xl overflow-hidden transition duration-300 ${
                isExpanded ? "shadow-md" : "hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition duration-300"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${getCategoryBg(faq.category)}`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${getCategoryColor(faq.category)}`}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {faq.question}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-2">
                  <div className="ml-12">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h4 className="text-lg font-bold text-blue-800">
            Still Have Questions?
          </h4>
        </div>

        <p className="text-blue-700 mb-4">
          Our friendly staff is here to help you 24/7. Don't hesitate to reach
          out!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="tel:0962334807"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-500"
          >
            <Phone className="w-4 h-4" />
            Call Front Desk
          </Link>
          <button
            onClick={openChat}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-300 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Clock className="w-4 h-4" />
            <span>Response time: Usually within 2 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFAQs;
