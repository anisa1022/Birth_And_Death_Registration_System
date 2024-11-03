// DeathForm.jsx
import React from 'react';

export default function DeathForm({ formData, setFormData, handleSubmit, editingId, handleImageChange }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <select
          value={formData.dobId}
          onChange={(e) => setFormData({ ...formData, dobId: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Select Birth Certificate ID</option>
          {formData.birthRecords.map((record) => (
            <option key={record._id} value={record._id}>
              {record.dobId} - {record.fullName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={formData.dateOfDeath}
          onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
          className="px-4 py-2 border rounded-lg"
          placeholder="Date of Death"
        />
        <input
          type="text"
          value={formData.causeOfDeath}
          onChange={(e) => setFormData({ ...formData, causeOfDeath: e.target.value })}
          className="px-4 py-2 border rounded-lg"
          placeholder="Cause of Death"
        />
        <select
          value={formData.placeOfDeath}
          onChange={(e) => setFormData({ ...formData, placeOfDeath: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Select Place of Death</option>
          {formData.districts.map((district) => (
            <option key={district._id} value={district._id}>
              {district.discName}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleImageChange} className="mt-4" />
      </div>
      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg mt-4">
        {editingId ? "Update Record" : "Save Record"}
      </button>
    </form>
  );
}
