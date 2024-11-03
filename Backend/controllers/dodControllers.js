import Dod from '../models/dodModel.js';
import District from '../models/districtsModel.js';
import Dob from '../models/dobModel.js';
import mongoose from 'mongoose';

// Get all date of death records

// export const createDodRecord = async (req, res) => {
//   try {
//     const { fullName, dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

//     const birthRecord = await Dob.findById(dob);
//     if (!birthRecord) {
//       return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
//     }

//     const placeOfDeathDistrict = await District.findById(placeOfDeath);
//     if (!placeOfDeathDistrict) {
//       return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
//     }

//     const lastRecord = await Dod.findOne().sort({ id: -1 });
//     const newId = lastRecord && lastRecord.id ? lastRecord.id + 1 : 101;

//     const newDod = new Dod({
//       id: newId,
//       fullName,
//       dob: birthRecord._id,
//       image,
//       dateOfDeath,
//       causeOfDeath,
//       placeOfDeath: placeOfDeathDistrict._id,
//       paymentStatus: 0 // Default to Pending
//     });

//     const savedDod = await newDod.save();
//     res.status(201).json(savedDod);
//   } catch (error) {
//     console.error("Error in createDodRecord:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const createDodRecord = async (req, res) => {
  try {
    console.log("incoming data" , req.body)
    const { dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    // Check if the provided DOB ID exists
    const birthRecord = await Dob.findById(dob);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
    }

    // Validate placeOfDeath as a district
    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
    }

    // Generate auto-incremented ID for Dod record
    const lastRecord = await Dod.findOne().sort({ id: -1 });
    const newId = lastRecord && lastRecord.id ? lastRecord.id + 1 : 101;

    const newDod = new Dod({
      id: newId,
      dob: birthRecord._id, // Use the ObjectId of the birth record
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
      paymentStatus: 0 // Default to Pending
    });

    const savedDod = await newDod.save();

    // Populate dob to get the full name
    const populatedDod = await Dod.findById(savedDod._id).populate('dob', 'fullName').populate('placeOfDeath', 'discName');
    res.status(201).json(populatedDod);
  } catch (error) {
    console.error("Error in createDodRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDod = await Dod.findByIdAndUpdate(
      id,
      { paymentStatus: 1 },
      { new: true }
    );
    if (!updatedDod) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(updatedDod);
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllDodRecords = async (req, res) => {
  try {
    const dodRecords = await Dod.find().populate('placeOfDeath', 'discName').populate('dob', 'fullName'); // Only populate `discName` field
    res.status(200).json(dodRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single date of death record by ID
// export const getDodRecordById = async (req, res) => {
//   try {
//     const dodRecord = await Dod.findById(req.params.id).populate('placeOfDeath', 'discName');
//     if (!dodRecord) return res.status(404).json({ message: "Record not found" });
//     res.status(200).json(dodRecord);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getDodRecordById = async (req, res) => {
  try {
    const dodRecord = await Dod.findById(req.params.id)
      .populate('dob', 'fullName')
      .populate('placeOfDeath', 'discName');
    if (!dodRecord) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(dodRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a date of death record
// export const updateDodRecord = async (req, res) => {
//   try {
//     const { fullName, dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

//     // Validate the dob ID exists in the Dob collection
//     const birthRecord = await Dob.findById(dob);
//     if (!birthRecord) {
//       return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
//     }

//     // Validate the placeOfDeath ID exists in the District collection
//     const placeOfDeathDistrict = await District.findById(placeOfDeath);
//     if (!placeOfDeathDistrict) {
//       return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
//     }

//     const updatedData = {
//       fullName,
//       dob: birthRecord._id, // Ensure dob is the correct ObjectId
//       image,
//       dateOfDeath,
//       causeOfDeath,
//       placeOfDeath: placeOfDeathDistrict._id,
//     };

//     const updatedDod = await Dod.findByIdAndUpdate(req.params.id, updatedData, { new: true })
//       .populate('placeOfDeath', 'discName')
//       .populate('dob', 'dobId'); // Populate dobId for displaying in frontend

//     if (!updatedDod) return res.status(404).json({ message: "Record not found" });

//     res.status(200).json(updatedDod);
//   } catch (error) {
//     console.error("Error in updateDodRecord:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateDodRecord = async (req, res) => {
  try {
    console.log("incoming data" , req.body)
    console.log("Incoming request body:", req.body);
    const { dob, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    // Validate the dob ID exists in the Dob collection
    const birthRecord = await Dob.findById(dob);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
    }

    // Validate the placeOfDeath ID exists in the District collection
    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
    }

    const updatedData = {
      dob: birthRecord._id, // Use the MongoDB ObjectId for dob
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
    };

    const updatedDod = await Dod.findByIdAndUpdate(req.params.id, updatedData, { new: true })
      .populate('placeOfDeath', 'discName')
      .populate('dob', 'dobId fullName'); // Populate dobId and fullName for frontend display

    if (!updatedDod) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(updatedDod);
  } catch (error) {
    console.error("Error in updateDodRecord:", error);
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
