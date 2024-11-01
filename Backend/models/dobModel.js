import mongoose from "mongoose";
const dobSchema = mongoose.Schema({
    dobId: {
        type: Number,
        required: true,
        unique: true,
      },
    fullName:{
        type: String,
        require: true
    },
    image:{
        type: String,
        required: true
    },
    placeOfBirth: {
        type: String,  // Changed from ObjectId to String
        required: true,
    },
    dob: {
        type: Date,
        required: true,
      },
    gender:{
        type: String,
        require : true
    },
    materialState:{
        type : String,
        require: true
    },
    address: {
        type: String,  
        required: true,
    },
    motherName:{
        type : String ,
        require: true
    },
    dateOfIssue: {
        type: Date,
        required: true,
    },
    occupation:{
        type : String,
        require: true
    },
    expirationDate: {
        type: Date,
        required: true,
    },
},{
    timestamps: true
});

const Dob = mongoose.model('Dob', dobSchema);
export default Dob;