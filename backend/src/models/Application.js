import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "applied",
                "screening",
                "shortlisted",
                "interview",
                "selected",
                "rejected",
                "hired"
            ],
            default: "applied"
        },

        matchScore: {
            type: Number,
            default: 0
        },

        coverMessage: {
            type: String,
            maxlength: 1000
        },

        interviewDate: {
            type: Date
        },

        employerNotes: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    {
        job: 1,
        worker: 1
    },
    {
        unique: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;