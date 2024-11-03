// DeathTable.jsx
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function DeathTable({ records, handleEdit, handleDelete, handleView, handlePendingPaymentClick, districtMap }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Registered Death Records</h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Full Name</th>
            <th className="px-4 py-3 text-left">Date of Death</th>
            <th className="px-4 py-3 text-left">Cause of Death</th>
            <th className="px-4 py-3 text-left">Place of Death</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record._id}>
              <td className="px-4 py-4">{record.id}</td>
              <td className="px-4 py-4">
                <img src={record.image || ""} alt="record" className="w-16 h-16 object-cover rounded-md" />
              </td>
              <td className="px-4 py-4">{record.dob?.fullName || "N/A"}</td>
              <td className="px-4 py-4">{new Date(record.dateOfDeath).toLocaleDateString()}</td>
              <td className="px-4 py-4">{record.causeOfDeath}</td>
              <td className="px-4 py-4">{districtMap[record.placeOfDeath] || "N/A"}</td>
              <td className="px-4 py-4 text-center">
                {record.paymentStatus === 0 ? (
                  <button onClick={() => handlePendingPaymentClick(record)} className="px-3 py-1 bg-red-500 text-white rounded-full">
                    Pending
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full">Approved</span>
                )}
              </td>
              <td className="px-4 py-4 text-right">
                <button onClick={() => handleView(record)} className="text-blue-600 hover:text-blue-900 mr-2">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-900 mr-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(record._id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
