import { useEffect, useState } from "react";
import {
  BarChart3,
  Bed,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";
import AddRoomPage from "../../pages/dashboard-pages/DashboardAddRoomPage";
import DashboardStatsPage from "../../pages/dashboard-pages/DashboardStatsPage";
import { Link, Outlet, useLocation } from "react-router-dom";

// Main Dashboard Component
const DashboardLayout = () => {
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "rooms", label: "Rooms", icon: Bed, path: "/dashboard/rooms" },
    {
      id: "add-room",
      label: "Add Room",
      icon: Plus,
      path: "/dashboard/add-room",
      requiredPermission: "write",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/dashboard/bookings",
    },
    { id: "guests", label: "Guests", icon: Users, path: "/dashboard/guests" },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
      requiredPermission: "view_analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
      requiredPermission: "manage_users",
    },
  ];

  // const filteredMenuItems = menuItems.filter(
  //   (item) => !item.requiredPermission || hasPermission(item.requiredPermission)
  // );

  const getPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === currentPath);
    return currentItem ? currentItem.label : "Dashboard";
  };

  // const handleLogout = () => {
  //   logout();
  //   setUserDropdownOpen(false);
  // };

  return (
    <div className="div flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform translate-x-0 duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bed className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              HotelAdmin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="min-h-screen mt-6 px-3">
          {/* {filteredMenuItems.map((item) => { */}
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                // onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    isActive ? "text-blue-700" : "text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {/* {user?.name} */}
                Giang Le
              </p>
              <p className="text-xs text-gray-500">
                {/* {user?.role} */}
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-[63px] px-6 bg-white">
            <div className="flex items-center">
              <button
                // onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4"
              >
                <Menu className="h-6 w-6 text-gray-400" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {/* {user?.name} */}
                      Giang Le
                    </p>
                    <p className="text-xs text-gray-500">
                      {/* {user?.role} */}
                      Admin
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {/* {user?.name} */}
                        Giang Le
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* {user?.email} */}
                        legiangbmt09@gmail.com
                      </p>
                    </div>
                    <button
                      // onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        // onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
