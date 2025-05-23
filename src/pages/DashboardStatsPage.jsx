import { BarChart3, Bed, Calendar, DollarSign } from "lucide-react";

const DashboardStatsPage = () => {
  // const { hasPermission } = useAuth();

  const stats = [
    {
      label: "Total Rooms",
      value: "124",
      change: "+2.5%",
      icon: Bed,
      color: "bg-blue-500",
    },
    {
      label: "Active Bookings",
      value: "87",
      change: "+12.3%",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      label: "Revenue Today",
      value: "$12,450",
      change: "+8.2%",
      icon: DollarSign,
      color: "bg-purple-500",
      requiredPermission: "view_analytics",
    },
    {
      label: "Occupancy Rate",
      value: "78%",
      change: "+5.1%",
      icon: BarChart3,
      color: "bg-orange-500",
      requiredPermission: "view_analytics",
    },
  ];

  // const filteredStats = stats.filter(
  //   (stat) => !stat.requiredPermission || hasPermission(stat.requiredPermission)
  // );

  const recentBookings = [
    {
      id: "001",
      guest: "John Doe",
      room: "Deluxe Suite",
      checkin: "2025-05-24",
      status: "Confirmed",
    },
    {
      id: "002",
      guest: "Jane Smith",
      room: "Standard Room",
      checkin: "2025-05-25",
      status: "Pending",
    },
    {
      id: "003",
      guest: "Mike Johnson",
      room: "Presidential Suite",
      checkin: "2025-05-26",
      status: "Confirmed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* {filteredStats.map((stat, index) => ( */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Check-in</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-50">
                    <td className="py-3 text-sm text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {booking.guest}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {booking.room}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {booking.checkin}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsPage;
