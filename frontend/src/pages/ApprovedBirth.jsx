import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { fetchApprovedDobRecords } from '../services/dobService';
import { getAllDistricts } from '../services/districtService';

export default function ApprovedBirthCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [districtMap, setDistrictMap] = useState({});

  useEffect(() => {
    // Fetch districts to create a mapping
    getAllDistricts()
      .then((data) => {
        console.log('Fetched Approved Death Records:', data);
        setDistricts(data);
        const mapping = data.reduce((acc, district) => {
          acc[district._id] = district.discName;
          return acc;
        }, {});
        setDistrictMap(mapping);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });

    // Fetch approved birth records
    fetchApprovedDobRecords()
      .then((data) => {
        const mappedCertificates = data.map((certificate) => ({
          ...certificate,
          address: districtMap[certificate.address] || 'N/A', // Map address using districtMap
          placeOfBirth: districtMap[certificate.placeOfBirth] || 'N/A', // Map place of birth
        }));
        setCertificates(mappedCertificates);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading approved records:', error);
        setIsLoading(false);
      });
  }, [districtMap]); // Adding districtMap as a dependency

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Birth Certificates</h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {isLoading ? (
            <p>Loading certificates...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Date of Birth</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Gender</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Place of Birth</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate._id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{certificate.dobId}</td>
                      <td className="py-3 px-4">
                        <img src={certificate.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="py-3 px-4">{certificate.fullName}</td>
                      <td className="py-3 px-4">{new Date(certificate.dob).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{certificate.gender}</td>
                      <td className="py-3 px-4">{certificate.placeOfBirth}</td> {/* Display Place of Birth */}
                      <td className="py-3 px-4">{certificate.address}</td> {/* Display Address */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {certificate.paymentStatus === 1 ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
