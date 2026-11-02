import WorkerProfile from "../models/WorkerProfile.js";
import Certification from "../models/Certification.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { calculateMatchScore } from "../services/matching.service.js";

const getProfile = asyncHandler(
    async (req, res) => {
        const profile =
            await WorkerProfile.findOne({
                user: req.user._id
            }).populate(
                "user",
                "name email phone profileImage isVerified"
            );

        if (!profile) {
            throw new ApiError(
                404,
                "Worker profile not found"
            );
        }

        const certifications =
            await Certification.find({
                worker: req.user._id
            });

        res.status(200).json({
            success: true,
            profile,
            certifications
        });
    }
);

const updateProfile = asyncHandler(
    async (req, res) => {
        const allowedFields = [
            "bio",
            "jobTitle",
            "skills",
            "experience",
            "expectedSalary",
            "location",
            "languages",
            "availability"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] =
                    req.body[field];
            }
        });

        const profile =
            await WorkerProfile.findOneAndUpdate(
                {
                    user: req.user._id
                },
                {
                    $set: updates
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!profile) {
            throw new ApiError(
                404,
                "Worker profile not found"
            );
        }

        res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            profile
        });
    }
);

const addCertification = asyncHandler(
    async (req, res) => {
        const {
            name,
            issuingOrganization,
            issueDate,
            expiryDate,
            documentUrl
        } = req.body;

        if (!name) {
            throw new ApiError(
                400,
                "Certification name is required"
            );
        }

        const certification =
            await Certification.create({
                worker: req.user._id,
                name,
                issuingOrganization,
                issueDate,
                expiryDate,
                documentUrl
            });

        await WorkerProfile.findOneAndUpdate(
            {
                user: req.user._id
            },
            {
                $inc: {
                    trustScore: 10
                }
            }
        );

        res.status(201).json({
            success: true,
            message:
                "Certification added successfully",
            certification
        });
    }
);

const getRecommendedJobs =
    asyncHandler(
        async (req, res) => {
            const worker =
                await WorkerProfile.findOne({
                    user: req.user._id
                });

            if (!worker) {
                throw new ApiError(
                    404,
                    "Worker profile not found"
                );
            }

            const certificationCount =
                await Certification.countDocuments({
                    worker: req.user._id,
                    verificationStatus:
                        "verified"
                });

            const workerData = {
                ...worker.toObject(),
                certificationCount
            };

            const jobs =
                await Job.find({
                    status: "active"
                })
                    .populate(
                        "employer",
                        "name profileImage"
                    )
                    .lean();

            const recommendations =
                jobs.map((job) => {
                    const result =
                        calculateMatchScore(
                            workerData,
                            job
                        );

                    return {
                        ...job,
                        matchScore:
                            result.score,
                        matchBreakdown:
                            result.breakdown
                    };
                });

            recommendations.sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            );

            res.status(200).json({
                success: true,
                count:
                    recommendations.length,
                jobs: recommendations
            });
        }
    );

const getApplications =
    asyncHandler(
        async (req, res) => {
            const applications =
                await Application.find({
                    worker: req.user._id
                })
                    .populate(
                        "job",
                        "title category salaryMin salaryMax location status"
                    )
                    .populate(
                        "job.employer",
                        "name"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json({
                success: true,
                applications
            });
        }
    );

export {
    getProfile,
    updateProfile,
    addCertification,
    getRecommendedJobs,
    getApplications
};