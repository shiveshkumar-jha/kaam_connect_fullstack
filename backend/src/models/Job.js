import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        experienceRequired: {
            type: Number,
            default: 0
        },

        salaryMin: {
            type: Number,
            default: 0
        },

        salaryMax: {
            type: Number,
            default: 0
        },

        location: {
            city: {
                type: String,
                required: true
            },

            state: {
                type: String
            }
        },

        employmentType: {
            type: String,
            enum: [
                "full_time",
                "part_time",
                "contract",
                "temporary"
            ],
            default: "full_time"
        },

        vacancies: {
            type: Number,
            default: 1
        },

        status: {
            type: String,
            enum: [
                "active",
                "closed",
                "draft"
            ],
            default: "active"
        },

        expiresAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

jobSchema.index({
    title: "text",
    description: "text",
    category: "text",
    skills: "text"
});

const Job = mongoose.model("Job", jobSchema);

export default Job;