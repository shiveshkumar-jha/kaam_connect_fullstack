import EmployerProfile from "../models/EmployerProfile.js";
import WorkerProfile from "../models/WorkerProfile.js";
import Certification from "../models/Certification.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { calculateMatchScore } from "../services/matching.service.js";

const getProfile = asyncHandler(
    async (req, res) => {
        const profile =
            await EmployerProfile.findOne({
                user: req.user._id
            }).populate(
                "user",
                "name email phone profileImage isVerified"
            );

        if (!profile) {
            throw new ApiError(
                404,
                "Employer profile not found"
            );
        }

        res.status(200).json({
            success: true,
            profile
        });
    }
);

const updateProfile = asyncHandler(
    async (req, res) => {
        const allowedFields = [
            "companyName",
            "companyDescription",
            "industry",
            "location",
            "website"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] =
                    req.body[field];
            }
        });

        const profile =
            await EmployerProfile.findOneAndUpdate(
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
                "Employer profile not found"
            );
        }

        res.status(200).json({
            success: true,
            message:
                "Company profile updated",
            profile
        });
    }
);

const getCandidates =
    asyncHandler(
        async (req, res) => {
            const workers =
                await WorkerProfile.find()
                    .populate(
                        "user",
                        "name email phone profileImage isVerified"
                    )
                    .lean();

            const candidates =
                await Promise.all(
                    workers.map(
                        async (worker) => {
                            const certificationCount =
                                await Certification.countDocuments(
                                    {
                                        worker:
                                            worker.user._id,
                                        verificationStatus:
                                            "verified"
                                    }
                                );

                            return {
                                ...worker,
                                certificationCount
                            };
                        }
                    )
                );

            res.status(200).json({
                success: true,
                candidates
            });
        }
    );

const getRecommendedCandidates =
    asyncHandler(
        async (req, res) => {
            const { jobId } = req.params;

            const job =
                await Job.findOne({
                    _id: jobId,
                    employer:
                        req.user._id
                });

            if (!job) {
                throw new ApiError(
                    404,
                    "Job not found"
                );
            }

            const workers =
                await WorkerProfile.find()
                    .populate(
                        "user",
                        "name email phone profileImage isVerified"
                    )
                    .lean();

            const results =
                await Promise.all(
                    workers.map(
                        async (worker) => {
                            const certificationCount =
                                await Certification.countDocuments(
                                    {
                                        worker:
                                            worker.user._id,
                                        verificationStatus:
                                            "verified"
                                    }
                                );

                            const result =
                                calculateMatchScore(
                                    {
                                        ...worker,
                                        certificationCount
                                    },
                                    job
                                );

                            return {
                                ...worker,
                                matchScore:
                                    result.score,
                                matchBreakdown:
                                    result.breakdown
                            };
                        }
                    )
                );

            results.sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            );

            res.status(200).json({
                success: true,
                job,
                candidates: results
            });
        }
    );

const getDashboard =
    asyncHandler(
        async (req, res) => {
            const jobs =
                await Job.find({
                    employer: req.user._id
                });

            const jobIds =
                jobs.map(
                    (job) => job._id
                );

            const applications =
                await Application.find({
                    job: {
                        $in: jobIds
                    }
                });

            const stats = {
                activeJobs:
                    jobs.filter(
                        (job) =>
                            job.status ===
                            "active"
                    ).length,

                totalJobs:
                    jobs.length,

                totalApplications:
                    applications.length,

                shortlisted:
                    applications.filter(
                        (application) =>
                            application.status ===
                            "shortlisted"
                    ).length,

                interviews:
                    applications.filter(
                        (application) =>
                            application.status ===
                            "interview"
                    ).length,

                selected:
                    applications.filter(
                        (application) =>
                            application.status ===
                            "selected"
                    ).length,

                hired:
                    applications.filter(
                        (application) =>
                            application.status ===
                            "hired"
                    ).length,

                rejected:
                    applications.filter(
                        (application) =>
                            application.status ===
                            "rejected"
                    ).length
            };

            res.status(200).json({
                success: true,
                stats
            });
        }
    );

export {
    getProfile,
    updateProfile,
    getCandidates,
    getRecommendedCandidates,
    getDashboard
};