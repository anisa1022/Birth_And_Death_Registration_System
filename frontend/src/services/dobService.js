// dobService.js
import axios from 'axios';

const DOB_API_URL = 'http://localhost:5000/api/dob';

// Create a new DOB record
export const createDobRecord = async (dobData) => {
  try {
    const response = await axios.post(DOB_API_URL, dobData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create DOB record' };
  }
};

// Get all DOB records
export const getAllDobRecords = async () => {
  try {
    const response = await axios.get(DOB_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOB records' };
  }
};

// Get a single DOB record by ID
export const getDobRecordById = async (id) => {
  try {
    const response = await axios.get(`${DOB_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOB record' };
  }
};

// Update a DOB record by ID
export const updateDobRecord = async (id, dobData) => {
  try {
    const response = await axios.put(`${DOB_API_URL}/${id}`, dobData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update DOB record' };
  }
};

// Delete a DOB record by ID
export const deleteDobRecord = async (id) => {
  try {
    const response = await axios.delete(`${DOB_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete DOB record' };
  }
};
