import mongoose from "mongoose";

const employerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyDescription: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            trim: true
        },

        location: {
            city: String,
            state: String,
            pincode: String
        },

        website: {
            type: String,
            trim: true
        },

        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const EmployerProfile = mongoose.model(
    "EmployerProfile",
    employerProfileSchema
);

export default EmployerProfile;