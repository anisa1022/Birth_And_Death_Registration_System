import React, { useState } from 'react';
import DashboardLayout from '../components/layout';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function PaymentRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [methods, setMethods] = useState([
    { id: 1, methodName: 'EVC Plus', receiverNumber: '+252-615123456', amount: '50' },
    { id: 2, methodName: 'Zaad Service', receiverNumber: '+252-634123456', amount: '100' },
    { id: 3, methodName: 'Sahal', receiverNumber: '+252-363123456', amount: '75' },
  ]);

  const [newMethod, setNewMethod] = useState({
    methodName: '',
    receiverNumber: '',
    amount: ''
  });

  const [editingId, setEditingId] = useState(null); // State to track editing record ID

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Registration</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setNewMethod({ methodName: '', receiverNumber: '+252-', amount: '' });
              setEditingId(null); // Clear editing state when adding new record
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Hide Form' : 'Add Record'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="methodName"
                  value={newMethod.methodName}
                  onChange={handleInputChange}
                  placeholder="Method Name"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="receiverNumber"
                  value={newMethod.receiverNumber}
                  onChange={handleInputChange}
                  placeholder="Receiver Number"
                  maxLength={14}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="amount"
                  value={newMethod.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editingId ? 'Update Method' : 'Save Method'}
              </button>
            </form>
          </div>
        )}

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
                  <tr key={method.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{method.methodName}</td>
                    <td className="py-3 px-4">{method.receiverNumber}</td>
                    <td className="py-3 px-4">${method.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(method)} className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(method.id)}
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
