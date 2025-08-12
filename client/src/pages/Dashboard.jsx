import React, { useEffect, useState } from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6 bg-gray-50">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Total Creations */}
        <div className="flex justify-between items-center w-72 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="text-slate-600">
            <p className="text-sm font-medium">Total Creations</p>
            <h2 className="text-2xl font-bold text-gray-800">{creations.length}</h2>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex justify-between items-center w-72 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="text-slate-600">
            <p className="text-sm font-medium">Active Plan</p>
            <h2 className="text-2xl font-bold text-gray-800">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center shadow-md">
            <Gem className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <div className="animate-spin rounded-full h-11 w-11 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-lg font-semibold text-gray-700 mb-4">Recent Creations</p>
          <div className="space-y-3">
            {creations.length > 0 ? (
              creations.map((item) => <CreationItem key={item.id} item={item} />)
            ) : (
              <p className="text-gray-500 text-sm">No creations yet. Start creating!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
