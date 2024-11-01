import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Plus, Trash2, Edit } from 'lucide-react';
import { createDobRecord, getAllDobRecords, deleteDobRecord, updateDobRecord } from '../services/dobService';

export default function BirthRegistration() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    materialState: '',
    motherName: '',
    placeOfBirth: '',
    occupation: '',
    address: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getAllDobRecords().then((data) => {
      setRecords(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching records:", error);
      setIsLoading(false);
    });
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const newRecord = { ...formData, image };
    try {
      const createdRecord = await createDobRecord(newRecord);
      setRecords([...records, createdRecord]);
      setFormData({
        fullName: '',
        dob: '',
        gender: '',
        materialState: '',
        motherName: '',
        placeOfBirth: '',
        occupation: '',
        address: '',
      });
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Birth Registration</h2>
        
        <div className="flex gap-4">
          {/* Form Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Birth Record</h3>
            <form onSubmit={handleAddRecord} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Full Name"
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                placeholder="Date of Birth"
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                value={formData.materialState}
                onChange={(e) => setFormData({ ...formData, materialState: e.target.value })}
                placeholder="Marital Status"
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                placeholder="Mother's Name"
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                placeholder="Place of Birth"
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Occupation"
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="px-4 py-2 border rounded-lg"
              />
              <button
                type="submit"
                className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Record
              </button>
            </form>
          </div>

          {/* Image Upload Section */}
          <div className="w-1/3 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
            <label className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Upload Image
              <input type="file" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full h-auto rounded-lg border mt-4"
              />
            )}
          </div>
        </div>

        {/* Registered Records Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Registered Birth Records</h3>
          {isLoading ? (
            <p>Loading records...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mother's Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(record.dob).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.motherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => setEditingId(record._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteDistrict(record._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
