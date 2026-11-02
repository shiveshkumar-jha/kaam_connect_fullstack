import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        issuingOrganization: {
            type: String,
            trim: true
        },

        issueDate: {
            type: Date
        },

        expiryDate: {
            type: Date
        },

        documentUrl: {
            type: String
        },

        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Certification = mongoose.model(
    "Certification",
    certificationSchema
);

export default Certification;