import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout.jsx';
import ViewRecordModal from '../components/ViewRecordModal.jsx';
import { Plus, Trash2, Edit,Eye } from 'lucide-react';
import { createDobRecord, getAllDobRecords, deleteDobRecord, updateDobRecord } from '../services/dobService.js';
import { getAllDistricts } from '../services/districtService.js';
import PaymentModal from '../components/PaymentModel.jsx';
import { updatePaymentStatus } from '../services/paymentService.js';
export default function BirthRegistration() {
  const [records, setRecords] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtMap, setDistrictMap] = useState({});
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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // New state for the view modal
  const [viewRecord, setViewRecord] = useState(null); // New state to hold the record for viewing

  useEffect(() => {
    getAllDobRecords().then((data) => {
      setRecords(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching records:", error);
      setIsLoading(false);
    });

    getAllDistricts().then((data) => {
      setDistricts(data);
      const districtMapping = data.reduce((acc, district) => {
        acc[district._id] = district.discName;
        return acc;
      }, {});
      setDistrictMap(districtMapping);
    }).catch((error) => {
      console.error("Error fetching districts:", error);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const { fullName, dob, gender, materialState, motherName, placeOfBirth, occupation, address } = formData;

    try {
      let base64Image = '';
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        base64Image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }

      const newRecord = {
        fullName,
        dob,
        gender,
        materialState,
        motherName,
        placeOfBirth,
        occupation,
        address,
        image: base64Image,
        paymentStatus: 0, // Ensure new records are set to Pending
      };

      if (editingId) {
        await updateDobRecord(editingId, newRecord);
        setRecords(records.map((record) => (record._id === editingId ? { ...record, ...newRecord } : record)));
        setEditingId(null);
      } else {
        const createdRecord = await createDobRecord(newRecord);
        setRecords([...records, createdRecord]);
      }

      resetForm();
    } catch (error) {
      console.error("Error creating or updating record:", error);
    }
  };

  const handleEditRecord = (record) => {
    setFormData({
      fullName: record.fullName,
      dob: record.dob.split("T")[0],
      gender: record.gender,
      materialState: record.materialState,
      motherName: record.motherName,
      placeOfBirth: record.placeOfBirth._id,
      occupation: record.occupation,
      address: record.address._id,
    });
    setImagePreview(record.image);
    setEditingId(record._id);
    setIsFormVisible(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteDobRecord(id);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const handleViewRecordClick = (record) => {
    setViewRecord(record);
    setIsViewModalVisible(true);
  };

  const resetForm = () => {
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
    setEditingId(null);
    setIsFormVisible(false);
  };

  // const handlePaymentApproval = async () => {
  //   if (selectedRecord) {
  //     try {
  //       const updatedRecord = { ...selectedRecord, paymentStatus: 1 };
  //       await updateDobRecord(selectedRecord._id, updatedRecord);
  //       setRecords(records.map((record) => (record._id === selectedRecord._id ? updatedRecord : record)));
  //       setIsPaymentModalVisible(false);
  //     } catch (error) {
  //       console.error("Error updating payment status:", error);
  //     }
  //   }
  // };
  // const handlePendingPayment = (record, isBirthRecord) => {
  //   setSelectedRecord({
  //       certificate_Id: record._id,
  //       PaymentType: isBirthRecord ? 'Birth Certificate' : 'Death Certificate'
  //   });
  //   setIsPaymentModalVisible(true);
  // };
  // const handlePendingPaymentClick = (record) => {
  //   setIsPaymentModalVisible(true); // Open the payment modal
  //   setSelectedRecord(record); // Set the selected record
  //   handlePendingPayment(record, false)
  //   // Add additional actions here
  //   // For example: reset other fields, fetch additional data, etc.
  // };

  const handlePendingPaymentClick = (record) => {
    setSelectedRecord({
      ...record,
      certificate_Id: record._id,
      paymentType: 'Birth Certificate'
    });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentApproval = async (recordId, status) => {
    try {
      await updatePaymentStatus(recordId, status);
      setRecords(records.map((record) => (record._id === recordId ? { ...record, paymentStatus: status } : record)));
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Birth Registration</h2>

        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isFormVisible ? "Hide Form" : "Add Record"}
        </button>

        {isFormVisible && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">{editingId ? "Update Record" : "Add New Birth Record"}</h3>
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
                <select
                  value={formData.materialState}
                  onChange={(e) => setFormData({ ...formData, materialState: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="Mother's Name"
                  className="px-4 py-2 border rounded-lg"
                />
                <select
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Place of Birth</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>
                      {district.discName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Occupation"
                  className="px-4 py-2 border rounded-lg"
                />
                <select
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Address</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>
                      {district.discName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Record" : "Save Record"}
                </button>
              </form>
            </div>

            <div className="w-1/3 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
              <label className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
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
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Registered Birth Records</h3>
          {isLoading ? (
            <p>Loading records...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-4 whitespace-nowrap">{record.dobId}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <img
                        src={record.image || imagePreview}
                        alt="record"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.dob).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{districtMap[record.address] || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {record.paymentStatus === 0 ? (
                        <button
                          onClick={() => handlePendingPaymentClick(record)}
                          className="px-3 py-1 bg-red-500 text-white rounded-full"
                        >
                          Pending
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full">Approved</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                    {/* Add "View" Button */}
                    <button onClick={() => handleViewRecordClick(record)} className="text-blue-600 hover:text-blue-900 mr-2">
                      <Eye className="w-4 h-4" /> {/* Use Eye icon for "View" */}
                    </button>
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
          )}
        </div>
        {isPaymentModalVisible && (
          <PaymentModal
            selectedRecord={selectedRecord}
            setIsPaymentModalVisible={setIsPaymentModalVisible}
            updatePaymentStatus={handlePaymentApproval}
          />
        )}
        {/* View Record Modal */}
        {isViewModalVisible && (
          <ViewRecordModal
            record={viewRecord}
            setIsViewModalVisible={setIsViewModalVisible}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
