import express from 'express';
import {
  createDodRecord,
  getAllDodRecords,
  getDodRecordById,
  updateDodRecord,
  deleteDodRecord,
  getApprovedDodRecords,
  getPendingDodRecords,
  fetchDodRecordDetails,
  getTotalDodRecords,
  getTotalApprovedDodRecords 
} from '../controllers/dodControllers.js';
const router = express.Router();

router.post('/', createDodRecord); // Create new record
router.get('/', getAllDodRecords);
router.get('/approved', getApprovedDodRecords);  // Route for approved records
router.get('/pending', getPendingDodRecords);
router.get('/total-dod', getTotalDodRecords);
router.get('/total-approved-dod', getTotalApprovedDodRecords); // Get all records
// router.get('/:id', getDodRecordById); // Get a single record by ID
router.put('/:id', updateDodRecord); // Update a record by ID
router.delete('/:id', deleteDodRecord);
router.get('/:dod_id', fetchDodRecordDetails) // Delete a record by ID

export default router;
