// dodService.js
import axios from 'axios';

const DOD_API_URL = 'http://localhost:5000/api/dod';

// Create a new DOD record
export const createDodRecord = async (dodData) => {
  try {
    const response = await axios.post(DOD_API_URL, dodData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create DOD record' };
  }
};

// Get all DOD records
export const getAllDodRecords = async () => {
  try {
    const response = await axios.get(DOD_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOD records' };
  }
};

// Get a single DOD record by ID
export const getDodRecordById = async (id) => {
  try {
    const response = await axios.get(`${DOD_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOD record' };
  }
};

// Update a DOD record by ID
export const updateDodRecord = async (id, dodData) => {
  try {
    const response = await axios.put(`${DOD_API_URL}/${id}`, dodData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update DOD record' };
  }
};

// Delete a DOD record by ID
export const deleteDodRecord = async (id) => {
  try {
    const response = await axios.delete(`${DOD_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete DOD record' };
  }
};
