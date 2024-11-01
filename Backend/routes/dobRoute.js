import express from 'express';
import {
  createDobRecord,
  getAllDobRecords,
  getDobRecordById,
  updateDobRecord,
  deleteDobRecord,
} from '../controllers/dobControllers.js';

const router = express.Router();

// Route to create a new date of birth record
router.post('/', createDobRecord);

// Route to get all date of birth records
router.get('/', getAllDobRecords);

// Route to get a specific date of birth record by ID
router.get('/:id', getDobRecordById);

// Route to update a date of birth record by ID
router.put('/:id', updateDobRecord);

// Route to delete a date of birth record by ID
router.delete('/:id', deleteDobRecord);

export default router;
