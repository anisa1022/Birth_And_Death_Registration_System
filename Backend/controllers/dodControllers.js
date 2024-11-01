import Dod from '../models/dodModel.js';
import District from '../models/districtsModel.js';
import Dob from '../models/dobModel.js';
// Create a new date of death record
export const createDodRecord = async (req, res) => {
  try {
    const { fullName, dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    // Check if the provided DOB ID exists
    const birthRecord = await Dob.findById(dob);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
    }

    // Find place of death in Districts
    const trimmedPlaceOfDeath = placeOfDeath.trim();
    const placeOfDeathDistrict = await District.findOne({ discName: trimmedPlaceOfDeath });
    
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "Invalid district name for placeOfDeath" });
    }

    // Get the last record for auto-incremented ID
    const lastRecord = await Dod.findOne().sort({ id: -1 });
    const newId = lastRecord && lastRecord.id ? lastRecord.id + 1 : 101;

    const newDod = new Dod({
      id: newId,
      fullName,
      dob: birthRecord._id,
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
    });

    const savedDod = await newDod.save();
    res.status(201).json(savedDod);
  } catch (error) {
    console.error("Error in createDodRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all date of death records
export const getAllDodRecords = async (req, res) => {
  try {
    const dodRecords = await Dod.find().populate('placeOfDeath', 'discName'); // Only populate `discName` field
    res.status(200).json(dodRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single date of death record by ID
export const getDodRecordById = async (req, res) => {
  try {
    const dodRecord = await Dod.findById(req.params.id).populate('placeOfDeath', 'discName');
    if (!dodRecord) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(dodRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a date of death record
export const updateDodRecord = async (req, res) => {
  try {
    const { fullName, dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    const trimmedPlaceOfDeath = placeOfDeath ? placeOfDeath.trim() : null;
    let placeOfDeathDistrict;

    // Update the placeOfDeath if a new district name is provided
    if (trimmedPlaceOfDeath) {
      placeOfDeathDistrict = await District.findOne({ discName: trimmedPlaceOfDeath });
      if (!placeOfDeathDistrict) {
        return res.status(400).json({ message: "Invalid district name for placeOfDeath" });
      }
    }

    const updateData = {
      fullName,
      dob,
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict ? placeOfDeathDistrict._id : undefined,
    };

    const updatedDod = await Dod.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedDod) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updatedDod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a date of death record
export const deleteDodRecord = async (req, res) => {
  try {
    const deletedDod = await Dod.findByIdAndDelete(req.params.id);
    if (!deletedDod) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
