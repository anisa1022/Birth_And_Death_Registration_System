import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Plus, Trash2, Edit, Upload as UploadIcon } from 'lucide-react';
import { createDodRecord, getAllDodRecords, deleteDodRecord, updateDodRecord } from '../services/dodService';

export default function DeathRegistration() {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    fullName: '',
    dobId: '',
    dateOfDeath: '',
    causeOfDeath: '',
    placeOfDeath: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getAllDodRecords().then((data) => {
      setRecords(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching records:", error);
      setIsLoading(false);
    });
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (newRecord.fullName && newRecord.dobId && newRecord.dateOfDeath && newRecord.causeOfDeath && newRecord.placeOfDeath) {
      try {
        const createdRecord = await createDodRecord(newRecord);
        setRecords([...records, createdRecord]);
        setNewRecord({ fullName: '', dobId: '', dateOfDeath: '', causeOfDeath: '', placeOfDeath: '' });
      } catch (error) {
        console.error("Error creating record:", error);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteDodRecord(id);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleEditRecord = async (id, updatedData) => {
    try {
      const updatedRecord = await updateDodRecord(id, updatedData);
      setRecords(records.map((record) => (record._id === id ? updatedRecord : record)));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Death Registration</h2>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Death Record</h3>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={newRecord.fullName}
                onChange={(e) => setNewRecord({ ...newRecord, fullName: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={newRecord.dobId}
                onChange={(e) => setNewRecord({ ...newRecord, dobId: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Birth Certificate ID"
              />
              <input
                type="date"
                value={newRecord.dateOfDeath}
                onChange={(e) => setNewRecord({ ...newRecord, dateOfDeath: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Date of Death"
              />
              <input
                type="text"
                value={newRecord.causeOfDeath}
                onChange={(e) => setNewRecord({ ...newRecord, causeOfDeath: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cause of Death"
              />
              <input
                type="text"
                value={newRecord.placeOfDeath}
                onChange={(e) => setNewRecord({ ...newRecord, placeOfDeath: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Place of Death"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Save Record
            </button>
          </form>
          <div className="mt-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="upload"
            />
            <label
              htmlFor="upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer flex items-center justify-center hover:bg-blue-700"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Image
            </label>
            {selectedFile && <p className="mt-2 text-gray-600">{selectedFile.name}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Registered Death Records</h3>
          {isLoading ? (
            <p>Loading records...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Death</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause of Death</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place of Death</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                    <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{record.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(record.dateOfDeath).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.causeOfDeath}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.placeOfDeath?.discName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-blue-600 hover:text-blue-900 mr-2">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteRecord(record._id)} className="text-red-600 hover:text-red-900">
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
