import mongoose from "mongoose";

const workerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        jobTitle: {
            type: String,
            trim: true
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        experience: {
            type: Number,
            default: 0,
            min: 0
        },

        expectedSalary: {
            type: Number,
            default: 0
        },

        location: {
            city: String,
            state: String,
            pincode: String
        },

        languages: [
            {
                type: String,
                trim: true
            }
        ],

        availability: {
            type: String,
            enum: [
                "immediately",
                "within_7_days",
                "within_30_days",
                "not_available"
            ],
            default: "immediately"
        },

        trustScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const WorkerProfile = mongoose.model(
    "WorkerProfile",
    workerProfileSchema
);

export default WorkerProfile;