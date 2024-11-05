import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout';
import {
  fetchTotalDobRecords,
  fetchTotalApprovedDobRecords,
  fetchTotalMaleBirthRecords,
  fetchTotalFemaleBirthRecords,
} from '../services/dobService';
import {
  fetchTotalDodRecords,
  fetchTotalApprovedDodRecords,
  fetchTotalMaleDeathRecords,
  fetchTotalFemaleDeathRecords,
} from '../services/dodService';
import { Users, DollarSign, FileText, Globe } from 'lucide-react';

export default function Dashboard() {
  const [totalBirths, setTotalBirths] = useState(0);
  const [totalApprovedBirths, setTotalApprovedBirths] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalApprovedDeaths, setTotalApprovedDeaths] = useState(0);
  const [totalMaleBirths, setTotalMaleBirths] = useState(0);
  const [totalFemaleBirths, setTotalFemaleBirths] = useState(0);
  const [totalMaleDeaths, setTotalMaleDeaths] = useState(0);
  const [totalFemaleDeaths, setTotalFemaleDeaths] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const totalDobResponse = await fetchTotalDobRecords(); // Assuming this returns just the count directly
        const totalApprovedDobResponse = await fetchTotalApprovedDobRecords();
        const totalDodResponse = await fetchTotalDodRecords(); 
        const totalApprovedDodResponse = await fetchTotalApprovedDodRecords();
        const maleBirthsResponse = await fetchTotalMaleBirthRecords();
        const femaleBirthsResponse = await fetchTotalFemaleBirthRecords();
        const maleDeathsResponse = await fetchTotalMaleDeathRecords();
        const femaleDeathsResponse = await fetchTotalFemaleDeathRecords();
  
        // Assuming totalDobResponse, totalDodResponse, etc., return counts directly.
        setTotalBirths(totalDobResponse); // Access count from the response
        setTotalApprovedBirths(totalApprovedDobResponse);
        setTotalDeaths(totalDodResponse);
        setTotalApprovedDeaths(totalApprovedDodResponse);
        setTotalMaleBirths(maleBirthsResponse.count); // Access count for male births
        setTotalFemaleBirths(femaleBirthsResponse.count); // Access count for female births
        setTotalMaleDeaths(maleDeathsResponse.count); // Access count for male deaths
        setTotalFemaleDeaths(femaleDeathsResponse.count); // Access count for female deaths
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
        <div className="bg-pink-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalBirths}</h3>
              <p className="text-sm text-gray-500">Total Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Birth Records Card */}
        <div className="bg-green-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedBirths}</h3>
              <p className="text-sm text-gray-500">Total Approved Birth Records</p>
            </div>
            <div className="text-gray-500">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Male Birth Records Card */}
        <div className="bg-blue-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalMaleBirths}</h3>
              <p className="text-sm text-gray-500">Total Male Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Female Birth Records Card */}
        <div className="bg-purple-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalFemaleBirths}</h3>
              <p className="text-sm text-gray-500">Total Female Birth Records</p>
            </div>
            <div className="text-gray-500">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Death Records Card */}
        <div className="bg-red-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalDeaths}</h3>
              <p className="text-sm text-gray-500">Total Death Records</p>
            </div>
            <div className="text-gray-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Approved Death Records Card */}
        <div className="bg-orange-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalApprovedDeaths}</h3>
              <p className="text-sm text-gray-500">Total Approved Death Records</p>
            </div>
            <div className="text-gray-500">
              <Globe className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Male Death Records Card */}
        <div className="bg-teal-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalMaleDeaths}</h3>
              <p className="text-sm text-gray-500">Total Male Death Records</p>
            </div>
            <div className="text-gray-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Female Death Records Card */}
        <div className="bg-indigo-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{totalFemaleDeaths}</h3>
              <p className="text-sm text-gray-500">Total Female Death Records</p>
            </div>
            <div className="text-gray-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
