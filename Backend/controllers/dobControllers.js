import Dob from '../models/dobModel.js';
import District from '../models/districtsModel.js';

// Create a new date of birth record
export const createDobRecord = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    const { fullName, image, placeOfBirth, dob, gender, materialState, address, motherName, occupation } = req.body;
 
    const allDistricts = await District.find({});
    console.log("Available Districts:", allDistricts.map(d => ({ id: d._id, name: d.discName })));

    const trimmedPlaceOfBirth = placeOfBirth.trim();
    const trimmedAddress = address.trim();

    const placeOfBirthDistrict = await District.findOne({ _id: trimmedPlaceOfBirth });
    const addressDistrict = await District.findOne({ _id: trimmedAddress });

    if (!placeOfBirthDistrict || !addressDistrict) {
      console.log("Invalid District IDs:", { placeOfBirth, address });
      return res.status(400).json({ message: "Invalid district name(s) for placeOfBirth or address" });
    }

    // Find the last record and calculate new dobId
    const lastRecord = await Dob.findOne().sort({ dobId: -1 });
    const newDobId = lastRecord && lastRecord.dobId ? lastRecord.dobId + 1 : 101;

    if (isNaN(newDobId)) {
      console.error("Error: dobId is NaN");
      return res.status(500).json({ message: "Failed to generate a valid dobId" });
    }

    const dateOfIssue = new Date();
    const expirationDate = new Date(dateOfIssue);
    expirationDate.setFullYear(dateOfIssue.getFullYear() + 1);

    if (typeof image !== 'string') {
      return res.status(400).json({ message: 'Image must be a string' });
    }
    const newDob = new Dob({
      dobId: newDobId,
      fullName,
      image,
      placeOfBirth: placeOfBirthDistrict._id,
      dob,
      gender,
      materialState,
      address: addressDistrict._id,
      motherName,
      dateOfIssue,
      occupation,
      expirationDate,
      paymentStatus: 0
    });

    const savedDob = await newDob.save();
    res.status(201).json(savedDob);
  } catch (error) {
    console.error("Error in createDobRecord:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get all date of birth records
export const getAllDobRecords = async (req, res) => {
  try {
    const dobRecords = await Dob.find()
      .populate('placeOfBirth', 'discName')  // Populate only `discName` for placeOfBirth
      .populate('address', 'discName')       // Populate only `discName` for address
      .select('-__v');  // Exclude the `__v` field from the response

    const formattedRecords = dobRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single date of birth record by ID
export const getDobRecordById = async (req, res) => {
  try {
    const dobRecord = await Dob.findById(req.params.id)
      .populate('placeOfBirth address', 'discName')
      .select('-__v');

    if (!dobRecord) return res.status(404).json({ message: "Record not found" });

    const formattedRecord = {
      ...dobRecord._doc,
      dateOfIssue: dobRecord.dateOfIssue.toISOString().split('T')[0],
      expirationDate: dobRecord.expirationDate.toISOString().split('T')[0],
      dob: dobRecord.dob.toISOString().split('T')[0]
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a date of birth record
// Update a date of birth record
export const updateDobRecord = async (req, res) => {
  try {
    const { placeOfBirth, address, ...otherUpdates } = req.body;

    // Check if placeOfBirth is a valid district ID
    if (placeOfBirth) {
      const placeOfBirthDistrict = await District.findById(placeOfBirth.trim());
      if (!placeOfBirthDistrict) {
        return res.status(400).json({ message: "Invalid district ID for placeOfBirth" });
      }
      otherUpdates.placeOfBirth = placeOfBirthDistrict._id;
    }

    // Check if address is a valid district ID
    if (address) {
      const addressDistrict = await District.findById(address.trim());
      if (!addressDistrict) {
        return res.status(400).json({ message: "Invalid district ID for address" });
      }
      otherUpdates.address = addressDistrict._id;
    }

    // Update the record in the database
    const updatedDob = await Dob.findByIdAndUpdate(req.params.id, otherUpdates, { new: true })
      .populate('placeOfBirth address', 'discName')
      .select('-__v');

    if (!updatedDob) return res.status(404).json({ message: "Record not found" });

    const formattedRecord = {
      ...updatedDob._doc,
      dateOfIssue: updatedDob.dateOfIssue.toISOString().split('T')[0],
      expirationDate: updatedDob.expirationDate.toISOString().split('T')[0],
      dob: updatedDob.dob.toISOString().split('T')[0]
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    console.error("Error in updateDobRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a date of birth record
export const deleteDobRecord = async (req, res) => {
  try {
    const deletedDob = await Dob.findByIdAndDelete(req.params.id);
    if (!deletedDob) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved date of birth records (paymentStatus = 1)
export const getApprovedDobRecords = async (req, res) => {
  try {
    const approvedDobRecords = await Dob.find({ paymentStatus: 1 })
      .populate('placeOfBirth', 'discName')
      .populate('address', 'discName')
      .select('-__v');

    const formattedRecords = approvedDobRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending date of birth records (paymentStatus = 0)
export const getPendingDobRecords = async (req, res) => {
  try {
    const pendingRecords = await Dob.find({ paymentStatus: 0 })
      .populate('placeOfBirth', 'discName')
      .populate('address', 'discName')
      .select('-__v');

    const formattedRecords = pendingRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching pending records:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getBirthRecordDetails = async (req, res) => {
  try {
    const {  id } = req.params;

    const dobRecord = await Dob.findById(id)
      .populate('placeOfBirth address', 'discName')
      .select('-__v'); // Exclude version key

    if (!dobRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    const formattedRecord = {
      fullName: dobRecord.fullName,
      image : dobRecord.image,
      dateOfBirth: dobRecord.dob.toISOString().split('T')[0], // Format to YYYY-MM-DD
      placeOfBirth: dobRecord.placeOfBirth ? dobRecord.placeOfBirth.discName : 'N/A',
      idNumber: dobRecord.dobId,
      gender: dobRecord.gender,
      maritalStatus: dobRecord.materialState || 'N/A', // Ensure it's defined
      address: dobRecord.address ? dobRecord.address.discName : 'N/A',
      motherName: dobRecord.motherName || 'N/A',
      dateOfIssue: dobRecord.dateOfIssue.toISOString().split('T')[0],
      occupation: dobRecord.occupation || 'N/A',
      photo: dobRecord.image || '/default-image.png', // Fallback image if not provided
      mayorName: 'Cumar Maxamuud Maxamed' // Static value for now
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const getTotalDobRecords = async (req, res) => {
  try {
    const totalDobRecords = await Dob.countDocuments();
    res.status(200).json({ totalDobRecords });
  } catch (error) {
    console.error("Error in getTotalDobRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total approved birth records
export const getTotalApprovedDobRecords = async (req, res) => {
  try {
    const totalApprovedDobRecords = await Dob.countDocuments({ paymentStatus: 1 });
    res.status(200).json({ totalApprovedDobRecords });
  } catch (error) {
    console.error("Error in getTotalApprovedDobRecords:", error);
    res.status(500).json({ message: error.message });
  }
};
