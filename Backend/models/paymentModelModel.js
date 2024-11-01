import mongoose from "mongoose";
const paymentSchema = mongoose.Schema({
    dob_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dob',
        require: true,
    },
    PaymentMethod:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        require: true,
    },
    PaymentType:{
        type: String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
},{
    timestamp :true
})

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment