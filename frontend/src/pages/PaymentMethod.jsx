import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getAllPaymentMethods } from '../services/paymentMethodService'; // Assuming you have this function

export default function PaymentRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({
    methodName: '',
    receiverNumber: '+252-',
    amount: ''
  });
  const [editingId, setEditingId] = useState(null); // State to track editing record ID

  useEffect(() => {
    // Fetch payment methods from the database
    getAllPaymentMethods().then((data) => setMethods(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'receiverNumber') {
      if (!value.startsWith('+252-')) {
        setNewMethod((prev) => ({ ...prev, [name]: '+252-' }));
      } else if (/^\+252-\d{0,9}$/.test(value)) {
        setNewMethod((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewMethod((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newMethod.methodName && newMethod.receiverNumber && newMethod.amount) {
      if (editingId) {
        // Update existing record
        setMethods((prev) =>
          prev.map((method) =>
            method.id === editingId ? { ...method, ...newMethod } : method
          )
        );
        setEditingId(null); // Clear editing state
      } else {
        // Add new record
        setMethods((prev) => [...prev, { id: Date.now(), ...newMethod }]);
      }
      // Reset form
      setNewMethod({ methodName: '', receiverNumber: '+252-', amount: '' });
      setShowForm(false); // Close form after save
    }
  };

  const handleDelete = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleEdit = (method) => {
    setNewMethod(method); // Populate form with selected record
    setEditingId(method.id); // Set ID for tracking edits
    setShowForm(true); // Open form for editing
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Other code here */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Registered Payment Methods</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                    Method Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                    Receiver Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method) => (
                  <tr key={method._id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{method.methodName}</td>
                    <td className="py-3 px-4">{method.receiverNumber}</td>
                    <td className="py-3 px-4">${method.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(method)} className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(method._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
