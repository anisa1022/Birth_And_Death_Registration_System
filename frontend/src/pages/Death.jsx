import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Eye, Edit, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ADDRESSES = ['Wartanabada', 'Yaqshid', 'N/A'];

export default function DeathRegistration() {
  const [showForm, setShowForm] = useState(true);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    fullName: '',
    dateOfDeath: '',
    causeOfDeath: '',
    placeOfDeath: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRecord((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, dateOfDeath, causeOfDeath, placeOfDeath, image } = newRecord;

    // Validation for empty fields
    if (!fullName || !dateOfDeath || !causeOfDeath || !placeOfDeath || !image) {
      toast.error('Please fill in all fields and upload an image before saving.');
      return;
    }

    // Proceed with submission
    console.log('Submitting new death record:', newRecord);

    // Reset the form after submission
    setNewRecord({
      fullName: '',
      dateOfDeath: '',
      causeOfDeath: '',
      placeOfDeath: '',
      image: null,
    });
    setImagePreview('');
    toast.success('Record saved successfully!');
  };

  // Prevent numeric input in "Cause of Death"
  
  return (
    <DashboardLayout>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Death Registration</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Hide Form' : 'Add Record'}
          </button>
        </div>

        {showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Death Record</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={newRecord.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="dateOfDeath"
                  value={newRecord.dateOfDeath}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="causeOfDeath"
                  value={newRecord.causeOfDeath}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key >= '0' && e.key <= '9') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Cause of Death"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="placeOfDeath"
                  value={newRecord.placeOfDeath}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Place of Death</option>
                  {ADDRESSES.map((address) => (
                    <option key={address} value={address}>
                      {address}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="md:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Record
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
              <label className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                Upload Image
                <input type="file" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg border mt-4" />
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Registered Death Records</h3>
          {isLoading ? (
            <p>Loading death records...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Death</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause of Death</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place of Death</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{record.id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{record.fullName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(record.dateOfDeath).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{record.causeOfDeath}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{record.placeOfDeath}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${record.paymentStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.paymentStatus === 'Approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600">Pay</button>
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
