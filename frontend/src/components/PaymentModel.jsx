import { useState, useEffect } from 'react';
import { getPaymentMethods, createPayment } from '../services/paymentService';

function PaymentModal({ selectedRecord, setIsPaymentModalVisible, updatePaymentStatus }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formData, setFormData] = useState({
    recordId: selectedRecord.certificate_Id || selectedRecord.dobId || selectedRecord._id,
    fullName: selectedRecord.fullName,
    paymentMethodId: '',
    receiverNumber: '',
    paymentType: selectedRecord.paymentType || 'Birth Certificate', // Default if paymentType is absent
    amount: '',
    senderNumber: ''
  });

  useEffect(() => {
    getPaymentMethods().then((data) => setPaymentMethods(data));
  }, []);

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = paymentMethods.find((method) => method._id === e.target.value);
    setFormData({
      ...formData,
      paymentMethodId: selectedMethod._id,
      receiverNumber: selectedMethod.receiverNumber,
      amount: selectedMethod.amount
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleApprovePayment = async () => {
    try {
      const payload = {
        certificate_Id: formData.recordId,
        paymentMethod: formData.paymentMethodId,
        PaymentType: formData.paymentType,
        senderNumber: formData.senderNumber
      };

      await createPayment(payload);
      updatePaymentStatus(selectedRecord._id, 1); // Update status to "Approved"
      setIsPaymentModalVisible(false);
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h3 className="text-lg font-semibold mb-4">Approve Payment</h3>
        <form className="space-y-4">
          <input 
            type="text" 
            value={`ID: ${formData.recordId} | Name: ${formData.fullName}`} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <select 
            name="paymentMethodId" 
            value={formData.paymentMethodId} 
            onChange={handlePaymentMethodChange} 
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method._id} value={method._id}>{method.methodName}</option>
            ))}
          </select>
          <input 
            type="text" 
            name="receiverNumber" 
            value={formData.receiverNumber} 
            disabled 
            placeholder="Receiver Number" 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="paymentType" 
            value={formData.paymentType} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="amount" 
            value={formData.amount} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="senderNumber" 
            value={formData.senderNumber} 
            onChange={handleInputChange} 
            placeholder="Sender Number" 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setIsPaymentModalVisible(false)} 
              className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleApprovePayment} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Approve Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
