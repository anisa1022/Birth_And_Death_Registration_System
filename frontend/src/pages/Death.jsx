import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Plus, Trash2, Edit, Upload as UploadIcon } from 'lucide-react';
import { createDodRecord, getAllDodRecords, deleteDodRecord, updateDodRecord , getDodRecordById} from '../services/dodService';
import { getAllDistricts } from '../services/districtService';
import { getAllDobRecords } from '../services/dobService';

export default function DeathRegistration() {
  const [records, setRecords] = useState([]);
  const [birthRecords, setBirthRecords] = useState([]); // Store all birth records
  const [districts, setDistricts] = useState([]);
  const [newRecord, setNewRecord] = useState({
    fullName: '',
    dobId: '', // This stores the selected dobId (sequential ID)
    dateOfDeath: '',
    causeOfDeath: '',
    placeOfDeath: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch all death records
    getAllDodRecords().then((data) => {
      setRecords(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching records:", error);
      setIsLoading(false);
    });

    // Fetch all districts
    getAllDistricts().then((data) => {
      setDistricts(data);
    }).catch((error) => {
      console.error("Error fetching districts:", error);
    });

    // Fetch all birth records to populate dobId dropdown
    getAllDobRecords().then((data) => {
      setBirthRecords(data); // Store birth records for the dropdown
    }).catch((error) => {
      console.error("Error fetching birth records:", error);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      let base64Image = '';
      if (image) {
        base64Image = await convertToBase64(image);
      }
  
      // Find the MongoDB _id based on selected dobId
      const selectedBirthRecord = birthRecords.find(record => record.dobId === parseInt(newRecord.dobId));
      if (!selectedBirthRecord) {
        console.error("Selected birth certificate ID is invalid.");
        return;
      }
  
      const recordData = {
        ...newRecord,
        dob: selectedBirthRecord._id, // Use MongoDB _id for dob
        image: base64Image,
      };
  
      // Step 1: Create the record
      const createdRecord = await createDodRecord(recordData);
  
      // Step 2: Fetch the newly created record with populated fields
      const fetchedRecord = await getDodRecordById(createdRecord._id); // Assuming `getDodRecordById` fetches a single record with populated fields
  
      // Step 3: Update the state with the populated record
      setRecords([...records, fetchedRecord]);
      resetForm();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };
  

  // Function to format the date to "yyyy-MM-dd"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };
  const handleEditRecord = (record) => {
    setNewRecord({
      fullName: record.fullName,
      dobId: record.dob && record.dob.dobId ? record.dob.dobId.toString() : '', // Only convert to string if dobId exists
      dateOfDeath: formatDate(record.dateOfDeath), // Format the date to "yyyy-MM-dd"
      causeOfDeath: record.causeOfDeath,
      placeOfDeath: record.placeOfDeath?._id || '', // Ensure placeOfDeath ID is populated correctly
    });
    setImagePreview(record.image); // Show existing image if available
    setEditingId(record._id); // Set the editing ID
    setShowForm(true); // Show the form
  };
  
  

  // const handleUpdateRecord = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let base64Image = '';
  //     if (image) {
  //       base64Image = await convertToBase64(image);
  //     }

  //     const selectedBirthRecord = birthRecords.find(record => record.dobId === parseInt(newRecord.dobId));
  //     if (!selectedBirthRecord) {
  //       console.error("Selected birth certificate ID is invalid.");
  //       return;
  //     }

  //     const updatedData = {
  //       ...newRecord,
  //       dob: selectedBirthRecord._id, // Use MongoDB _id for dob
  //       image: base64Image || imagePreview,
  //     };

  //     const updatedRecord = await updateDodRecord(editingId, updatedData);
  //     setRecords(records.map((record) => (record._id === editingId ? updatedRecord : record)));
  //     resetForm();
  //   } catch (error) {
  //     console.error("Error updating record:", error);
  //   }
  // };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      let base64Image = '';
      if (image) {
        base64Image = await convertToBase64(image);
      }
  
      // Find the MongoDB _id based on selected dobId
      const selectedBirthRecord = birthRecords.find(record => record.dobId === parseInt(newRecord.dobId));
      if (!selectedBirthRecord) {
        console.error("Selected birth certificate ID is invalid.");
        return;
      }
  
      const updatedData = {
        ...newRecord,
        dob: selectedBirthRecord._id, // Use MongoDB _id for dob
        image: base64Image || imagePreview,
      };
  
      // Step 1: Update the record
      await updateDodRecord(editingId, updatedData);
  
      // Step 2: Fetch the updated record with populated fields
      const fetchedRecord = await getDodRecordById(editingId); // Fetch the updated record with populated fields
  
      // Step 3: Update the state with the populated record
      setRecords(records.map((record) => (record._id === editingId ? fetchedRecord : record)));
      resetForm();
    } catch (error) {
      console.error("Error updating record:", error);
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

  const resetForm = () => {
    setNewRecord({ fullName: '', dobId: '', dateOfDeath: '', causeOfDeath: '', placeOfDeath: '' });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Death Registration</h2>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
        >
          {showForm ? "Hide Form" : "Add Record"}
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingId ? "Update Death Record" : "Add New Death Record"}</h3>
            <form onSubmit={editingId ? handleUpdateRecord : handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newRecord.fullName}
                  onChange={(e) => setNewRecord({ ...newRecord, fullName: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  placeholder="Full Name"
                />
                <select
                  value={newRecord.dobId} // This should now match correctly
                  onChange={(e) => setNewRecord({ ...newRecord, dobId: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Birth Certificate ID</option>
                  {birthRecords.map((record) => (
                    <option key={record._id} value={record.dobId.toString()}> {/* Ensure dobId is treated as a string */}
                      {record.dobId} - {record.fullName}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newRecord.dateOfDeath}
                  onChange={(e) => setNewRecord({ ...newRecord, dateOfDeath: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  placeholder="Date of Death"
                />
                <input
                  type="text"
                  value={newRecord.causeOfDeath}
                  onChange={(e) => setNewRecord({ ...newRecord, causeOfDeath: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  placeholder="Cause of Death"
                />
                <select
                  value={newRecord.placeOfDeath}
                  onChange={(e) => setNewRecord({ ...newRecord, placeOfDeath: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Place of Death</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>{district.discName}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <input
                  type="file"
                  onChange={handleImageChange}
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
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full mt-2 rounded-lg" />}
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                {editingId ? "Update Record" : "Save Record"}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Registered Death Records</h3>
          {isLoading ? (
            <p>Loading records...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Death</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cause of Death</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Place of Death</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record, index) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(record.dateOfDeath).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.causeOfDeath}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.placeOfDeath?.discName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleEditRecord(record)} className="text-blue-600 hover:text-blue-900 mr-2">
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
