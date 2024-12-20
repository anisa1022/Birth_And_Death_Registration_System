import mongoose from "mongoose";
const dodSchema = mongoose.Schema({
    id:{
        type: Number,
        require: true,
        
    },
    
    dob:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dob',
    },
    image:{
        type: String,
        require: true,
    },
    dateOfDeath:{
        type: Date,
        require: true
    },
    causeOfDeath:{
        type: String,
        require: true
    },
    placeOfDeath:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        require: true,
    },
    paymentStatus: { type: Number, default: 0 },
},{
    timestamp: true
});

const Dod = mongoose.model('Dod', dodSchema);
export default Dod