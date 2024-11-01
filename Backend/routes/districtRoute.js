import express from 'express';
import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
} from '../controllers/districtControllers.js';

const router = express.Router();

router.post('/', createDistrict); // Create new district
router.get('/', getAllDistricts); // Get all districts
router.get('/:id', getDistrictById); // Get a specific district by ID
router.put('/:id', updateDistrict); // Update a district by ID
router.delete('/:id', deleteDistrict); // Delete a district by ID

export default router;
