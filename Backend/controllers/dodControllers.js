import Dod from '../models/dodModel.js';
import District from '../models/districtsModel.js';
import Dob from '../models/dobModel.js';
import mongoose from 'mongoose';

// Get all date of death records

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

export const getAllDodRecords = async (req, res) => {
  try {
    const dodRecords = await Dod.find().populate('placeOfDeath', 'discName').populate('dob', 'fullName'); // Only populate `discName` field
    res.status(200).json(dodRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single date of death record by ID

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
// Get all approved Dod records
export const getApprovedDodRecords = async (req, res) => {
  try {
    const approvedDodRecords = await Dod.find({ paymentStatus: 1 })
      .populate('dob', 'fullName')
      .populate('placeOfDeath', 'discName')
      .select('-__v'); // Exclude the __v field

    res.status(200).json(approvedDodRecords);
  } catch (error) {
    console.error("Error in getApprovedDodRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending Dod records
export const getPendingDodRecords = async (req, res) => {
  try {
    const pendingDodRecords = await Dod.find({ paymentStatus: 0 })
      .populate('dob', 'fullName')
      .populate('placeOfDeath', 'discName')
      .select('-__v'); // Exclude the __v field

    res.status(200).json(pendingDodRecords);
  } catch (error) {
    console.error("Error in getPendingDodRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchDodRecordDetails = async (req, res) => {
  const { dod_id } = req.params;
  console.log('Dod ID:', dod_id);

  if (!mongoose.Types.ObjectId.isValid(dod_id)) {
    return res.status(400).json({ message: 'Invalid Dod ID format' });
  }

  try {
    // Find the Dod record by ID and populate related fields from Dob and District
    const dodRecord = await Dod.findById(dod_id)
      .select('id image dateOfDeath causeOfDeath placeOfDeath')
      .populate({
        path: 'dob',
        model: Dob,
        select: 'fullName dobId motherName gender occupation dob address',
        populate: {
          path: 'address',
          model: District, // Assuming `address` references District collection for discName
          select: 'discName',
        },
      })
      .populate({
        path: 'placeOfDeath',
        model: District,
        select: 'discName',
      });

    if (!dodRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Prepare response with fields from Dod, Dob, and District
    const responseData = {
      dodSequenceID: dodRecord.id,
      image: dodRecord.image,
      dateOfDeath: dodRecord.dateOfDeath,
      causeOfDeath: dodRecord.causeOfDeath,
      placeOfDeath: dodRecord.placeOfDeath ? dodRecord.placeOfDeath.discName : null,
      fullName: dodRecord.dob ? dodRecord.dob.fullName : null,
      dobSequenceID: dodRecord.dob ? dodRecord.dob.dobId : null,
      motherName: dodRecord.dob ? dodRecord.dob.motherName : null,
      gender: dodRecord.dob ? dodRecord.dob.gender : null,
      dateOfBirth: dodRecord.dob ? dodRecord.dob.dob : null,
      address: dodRecord.dob ? dodRecord.dob.address : null,
      occupation: dodRecord.dob ? dodRecord.dob.occupation : null, // Ensure this exists

    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching record details' });
  }
};

// Get total death records
export const getTotalDodRecords = async (req, res) => {
  try {
    const totalDodRecords = await Dod.countDocuments();
    res.status(200).json({ totalDodRecords });
  } catch (error) {
    console.error("Error in getTotalDodRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total approved death records
export const getTotalApprovedDodRecords = async (req, res) => {
  try {
    const totalApprovedDodRecords = await Dod.countDocuments({ paymentStatus: 1 });
    res.status(200).json({ totalApprovedDodRecords });
  } catch (error) {
    console.error("Error in getTotalApprovedDodRecords:", error);
    res.status(500).json({ message: error.message });
  }
};
 // Adjust the path according to your project structure

export const fetchTotalMaleDeathRecords = async (req, res) => {
  try {
    const count = await Dod.aggregate([
      {
        $lookup: {
          from: 'dobs', // Name of the Dob collection
          localField: 'dobId', // Field in Dod that references Dob
          foreignField: '_id', // Field in Dob that is referenced
          as: 'dobDetails', // Name of the array where matched Dob records will be stored
        },
      },
      {
        $unwind: '$dobDetails', // Deconstructs the array to create a separate document for each element
      },
      {
        $match: { 'dobDetails.gender': 'Male' }, // Filter by male gender
      },
      {
        $count: 'count', // Count the resulting documents
      },
    ]);

    // If no male deaths are found, return 0
    const maleDeathCount = count.length > 0 ? count[0].count : 0;
    res.status(200).json({ count: maleDeathCount });
  } catch (error) {
    console.error("Error in fetchTotalMaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// export const fetchTotalFemaleDeathRecords = async (req, res) => {
//   try {
//     const count = await Dod.countDocuments({ gender: 'Female' }); // Assuming 'gender' field holds the value 'Female'
//     res.status(200).json({ count });
//   } catch (error) {
//     console.error("Error in fetchTotalFemaleDeathRecords:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const fetchTotalFemaleDeathRecords = async (req, res) => {
  try {
    const count = await Dod.aggregate([
      {
        $lookup: {
          from: 'dobs', // Name of the Dob collection
          localField: 'dobId', // Field in Dod that references Dob
          foreignField: '_id', // Field in Dob that is referenced
          as: 'dobDetails', // Name of the array where matched Dob records will be stored
        },
      },
      {
        $unwind: '$dobDetails', // Deconstructs the array to create a separate document for each element
      },
      {
        $match: { 'dobDetails.gender': 'Female' }, // Filter by female gender
      },
      {
        $count: 'count', // Count the resulting documents
      },
    ]);

    // If no female deaths are found, return 0
    const femaleDeathCount = count.length > 0 ? count[0].count : 0;
    res.status(200).json({ count: femaleDeathCount });
  } catch (error) {
    console.error("Error in fetchTotalFemaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};





