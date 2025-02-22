import React from "react";
import { Link } from "react-router-dom";
import { FaCog, FaUserFriends, FaClipboardList, FaChartBar } from "react-icons/fa";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
        <Link to="/settings" className="text-gray-600 hover:text-gray-800">
          <FaCog size={24} /> {/* ✅ No error now */}
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaUserFriends className="text-blue-500 text-3xl mr-4" /> {/* ✅ Fixed */}
          <div>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-gray-600 text-xl">1,245</p>
          </div>
        </div>

        {/* Posts Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaClipboardList className="text-green-500 text-3xl mr-4" /> {/* ✅ Fixed */}
          <div>
            <h2 className="text-lg font-semibold">Total Posts</h2>
            <p className="text-gray-600 text-xl">890</p>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaChartBar className="text-purple-500 text-3xl mr-4" /> {/* ✅ Fixed */}
          <div>
            <h2 className="text-lg font-semibold">Engagement</h2>
            <p className="text-gray-600 text-xl">87%</p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCog className="text-gray-500 text-3xl mr-4" /> {/* ✅ Fixed */}
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-gray-600 text-xl">Manage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
