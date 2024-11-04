import express from 'express';
import {
  createDobRecord,
  getAllDobRecords,
  getDobRecordById,
  updateDobRecord,
  deleteDobRecord,
  getApprovedDobRecords,
  getPendingDobRecords,
  getBirthRecordDetails,
  getTotalDobRecords,
  getTotalApprovedDobRecords,
} from '../controllers/dobControllers.js';

const router = express.Router();

// Route to create a new date of birth record
router.post('/', createDobRecord);

// Route to get all date of birth records
router.get('/', getAllDobRecords);

// Route to get a specific date of birth record by ID


// Route to update a date of birth record by ID
router.put('/:id', updateDobRecord);

// Route to delete a date of birth record by ID
router.delete('/:id', deleteDobRecord);

router.get('/approved', getApprovedDobRecords); // This will handle /api/dob/approved

router.get('/pending', getPendingDobRecords); 

router.get('/total-dob', getTotalDobRecords);
router.get('/total-approved-dob', getTotalApprovedDobRecords);

router.get('/:id', getDobRecordById);
router.get('/birth/:id', getBirthRecordDetails);

export default router;
