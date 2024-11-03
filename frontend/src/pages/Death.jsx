import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import DeathForm from '../components/DeathForm';
import ImageUpload from '../components/ImageUpload';
import DeathTable from '../components/DeathTable';
import ViewRecordModal from '../components/ViewRecordModal';
import PaymentModal from '../components/PaymentModel'
import { createDodRecord, getAllDodRecords, deleteDodRecord, updateDodRecord } from '../services/dodService';
import { getAllDistricts } from '../services/districtService';
import { getAllDobRecords } from '../services/dobService';

export default function DeathRegistration() {
  // State variables
  const [records, setRecords] = useState([]);
  const [birthRecords, setBirthRecords] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [newRecord, setNewRecord] = useState({
    dobId: '',
    dateOfDeath: '',
    causeOfDeath: '',
    placeOfDeath: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [districtMap, setDistrictMap] = useState({});

  // Fetch records, districts, and birth records on mount
  useEffect(() => {
    getAllDodRecords().then((data) => setRecords(data));
    getAllDistricts().then((data) => {
      setDistricts(data);
      const mapping = data.reduce((acc, district) => {
        acc[district._id] = district.discName;
        return acc;
      }, {});
      setDistrictMap(mapping);
    });
    getAllDobRecords().then((data) => setBirthRecords(data));
  }, []);

  // Handle form submission for adding a record
  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      let base64Image = '';
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        base64Image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }
      const recordData = { ...newRecord, image: base64Image };
      const createdRecord = await createDodRecord(recordData);
      setRecords([...records, createdRecord]);
      resetForm();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  // Handle form submission for updating a record
  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      let base64Image = '';
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        base64Image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }
      const updatedData = { ...newRecord, image: base64Image || imagePreview };
      const updatedRecord = await updateDodRecord(editingId, updatedData);
      setRecords(records.map((record) => (record._id === editingId ? updatedRecord : record)));
      resetForm();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  // Handle editing a record
  const handleEditRecord = (record) => {
    setNewRecord({
      dobId: record.dob?._id || '',
      dateOfDeath: formatDate(record.dateOfDeath),
      causeOfDeath: record.causeOfDeath,
      placeOfDeath: record.placeOfDeath?._id || '',
    });
    setImagePreview(record.image);
    setEditingId(record._id);
    setShowForm(true);
  };

  // Handle deleting a record
  const handleDeleteRecord = async (id) => {
    try {
      await deleteDodRecord(id);
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Handle viewing a record
  const handleViewRecordClick = (record) => {
    setViewRecord(record);
    setIsViewModalVisible(true);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle image change for file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewRecord({ dobId: '', dateOfDeath: '', causeOfDeath: '', placeOfDeath: '' });
    setImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  // Handle payment approval
  const handlePaymentApproval = async () => {
    if (selectedRecord) {
      try {
        await updateDodRecord(selectedRecord._id, { paymentStatus: 1 });
        setRecords(records.map((record) =>
          record._id === selectedRecord._id ? { ...record, paymentStatus: 1 } : record
        ));
        setIsPaymentModalVisible(false);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    }
  };

  // Handle pending payment button click
  const handlePendingPaymentClick = (record) => {
    setSelectedRecord(record);
    setIsPaymentModalVisible(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Death Registration</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Hide Form" : "Add Record"}
        </button>
        {showForm && (
          <div className="flex gap-4">
            <DeathForm
              formData={{ ...newRecord, birthRecords, districts }}
              setFormData={setNewRecord}
              handleSubmit={editingId ? handleUpdateRecord : handleAddRecord}
              editingId={editingId}
              handleImageChange={handleImageChange}
            />
            <ImageUpload imagePreview={imagePreview} handleImageChange={handleImageChange} />
          </div>
        )}
        <DeathTable
          records={records}
          handleEdit={handleEditRecord}
          handleDelete={handleDeleteRecord}
          handleView={handleViewRecordClick}
          handlePendingPaymentClick={handlePendingPaymentClick}
          districtMap={districtMap}
        />
        {isPaymentModalVisible && (
          <PaymentModal
            selectedRecord={selectedRecord}
            setIsPaymentModalVisible={setIsPaymentModalVisible}
            handlePaymentApproval={handlePaymentApproval}
          />
        )}
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
