import { Bed, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import RoomsTable from "../../components/dashboard-pages/rooms-page/RoomsTable";

const DashboardRoomsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="p-6 flex justify-between items-center ">
            <h2 className="text-2xl font-bold text-gray-900">
              Room Management
            </h2>
            <Link
              to="/dashboard/add-room"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Room
            </Link>
          </div>
        </div>

        <RoomsTable />
      </div>
    </div>
  );
};

export default DashboardRoomsPage;
