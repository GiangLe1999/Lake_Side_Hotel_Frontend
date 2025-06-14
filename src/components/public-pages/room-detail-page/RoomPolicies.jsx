import React, { useState } from "react";
import {
  Shield,
  Clock,
  Ban,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  CreditCard,
  Users,
  Volume2,
  Baby,
  PawPrint,
} from "lucide-react";

const RoomPolicies = ({ room }) => {
  const [activeTab, setActiveTab] = useState("checkin");

  const checkInPolicies = [
    {
      icon: Clock,
      title: "Check-in Time",
      description: "3:00 PM - 11:00 PM",
      type: "info",
    },
    {
      icon: Clock,
      title: "Check-out Time",
      description: "Before 12:00 PM",
      type: "info",
    },
    {
      icon: Calendar,
      title: "Early Check-in",
      description: "Available from 1:00 PM (subject to availability)",
      type: "info",
    },
    {
      icon: Calendar,
      title: "Late Check-out",
      description: "Until 2:00 PM with additional fee",
      type: "info",
    },
  ];

  const cancellationPolicies = [
    {
      icon: CheckCircle,
      title: "Free Cancellation",
      description: "Cancel up to 24 hours before check-in for full refund",
      type: "success",
    },
    {
      icon: AlertTriangle,
      title: "Late Cancellation",
      description: "Less than 24 hours: 50% charge of first night",
      type: "warning",
    },
    {
      icon: Ban,
      title: "No-show Policy",
      description: "Full charge applies if you don't show up",
      type: "error",
    },
    {
      icon: CreditCard,
      title: "Refund Processing",
      description: "Refunds processed within 5-7 business days",
      type: "info",
    },
  ];

  const houseRules = [
    {
      icon: Ban,
      title: "No Smoking",
      description: "Smoking is strictly prohibited in all areas",
      allowed: false,
    },
    {
      icon: Volume2,
      title: "Quiet Hours",
      description: "Please keep noise levels low after 10:00 PM",
      allowed: true,
    },
    {
      icon: Users,
      title: "Maximum Occupancy",
      description: `Up to ${room?.occupancy || 1} guests allowed`,
      allowed: true,
    },
    {
      icon: PawPrint,
      title: "Pets Policy",
      description: "Small pets allowed with additional fee ($25/night)",
      allowed: true,
    },
    {
      icon: Baby,
      title: "Children Welcome",
      description: "Children of all ages are welcome",
      allowed: true,
    },
  ];

  const tabs = [
    { id: "checkin", label: "Check-in/out", icon: Clock },
    { id: "cancellation", label: "Cancellation", icon: Shield },
    { id: "rules", label: "House Rules", icon: Info },
  ];

  const getIconColor = (type, allowed) => {
    if (allowed === false) return "text-red-500";
    if (allowed === true) return "text-green-500";

    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getBgColor = (type, allowed) => {
    if (allowed === false) return "bg-red-50 border-red-200";
    if (allowed === true) return "bg-green-50 border-green-200";

    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
          <Shield className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Policies & House Rules
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium rounded-t-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-yellow-50 text-yellow-600 border-b-2 border-yellow-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "checkin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkInPolicies.map((policy, index) => {
              const PolicyIcon = policy.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getBgColor(policy.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <PolicyIcon
                      className={`w-5 h-5 mt-1 ${getIconColor(policy.type)}`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {policy.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "cancellation" && (
          <div className="space-y-4">
            {cancellationPolicies.map((policy, index) => {
              const PolicyIcon = policy.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getBgColor(policy.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <PolicyIcon
                      className={`w-5 h-5 mt-1 ${getIconColor(policy.type)}`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {policy.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "rules" && (
          <div className="space-y-4">
            {houseRules.map((rule, index) => {
              const RuleIcon = rule.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getBgColor(
                    null,
                    rule.allowed
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    <RuleIcon
                      className={`w-5 h-5 mt-1 ${getIconColor(
                        null,
                        rule.allowed
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {rule.title}
                        </h4>
                        {rule.allowed === true && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {rule.allowed === false && (
                          <Ban className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Please Note</h4>
            <p className="text-sm text-blue-700">
              All policies are subject to local regulations and may vary during
              special events or peak seasons. Please contact our front desk for
              any specific requirements or questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPolicies;
