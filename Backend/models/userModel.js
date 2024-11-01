import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,  // Note: use "timestamps" (plural) to enable automatic createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
