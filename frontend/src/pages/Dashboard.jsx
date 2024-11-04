import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout';
import { fetchTotalDobRecords, fetchTotalApprovedDobRecords } from '../services/dobService';
import { fetchTotalDodRecords, fetchTotalApprovedDodRecords } from '../services/dodService';
import { Users, DollarSign, FileText, Globe } from 'lucide-react';

export default function Dashboard() {
  const [totalBirths, setTotalBirths] = useState(0);
  const [totalApprovedBirths, setTotalApprovedBirths] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalApprovedDeaths, setTotalApprovedDeaths] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const totalDob = await fetchTotalDobRecords();
        const totalApprovedDob = await fetchTotalApprovedDobRecords();
        const totalDod = await fetchTotalDodRecords();
        const totalApprovedDod = await fetchTotalApprovedDodRecords();

        setTotalBirths(totalDob);
        setTotalApprovedBirths(totalApprovedDob);
        setTotalDeaths(totalDod);
        setTotalApprovedDeaths(totalApprovedDod);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Birth Records Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalBirths}</h3>
              <p className="text-sm text-gray-500">Total Birth Records</p>
            </div>
            <div className="text-gray-200">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Birth Records Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedBirths}</h3>
              <p className="text-sm text-gray-500">Total Approved Birth Records</p>
            </div>
            <div className="text-gray-200">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Death Records Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalDeaths}</h3>
              <p className="text-sm text-gray-500">Total Death Records</p>
            </div>
            <div className="text-gray-200">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Death Records Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedDeaths}</h3>
              <p className="text-sm text-gray-500">Total Approved Death Records</p>
            </div>
            <div className="text-gray-200">
              <Globe className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
