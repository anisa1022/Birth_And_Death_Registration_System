import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Replace with your backend URL if different

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Login user



export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Request failed' };
    }
};

// Get user profile
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/profile`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
