import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { fetchApprovedDodRecords } from '../services/dodService'; // Ensure you have this service function

export default function ApprovedDeathCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApprovedDodRecords()
      .then((data) => {
        console.log('Fetched Approved Death Records:', data); // Log the data to inspect its structure
        setCertificates(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading approved records:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Death Certificates</h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {isLoading ? (
            <p>Loading certificates...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Sequence ID</th> {/* Changed header */}
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Date of Death</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Cause of Death</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Place of Death</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate._id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{certificate.id || 'N/A'}</td> {/* Adjust to your actual ID field */}
                      <td className="py-3 px-4">
                        <img src={certificate.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="py-3 px-4">{certificate.dob ? certificate.dob.fullName : 'N/A'}</td> {/* Access fullName */}
                      <td className="py-3 px-4">{new Date(certificate.dateOfDeath).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{certificate.causeOfDeath}</td>
                      <td className="py-3 px-4">{certificate.placeOfDeath?.discName || 'N/A'}</td> {/* Check for discName */}
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
