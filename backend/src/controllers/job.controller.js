import Job from "../models/Job.js";
import Application from "../models/Application.js";
import WorkerProfile from "../models/WorkerProfile.js";
import Certification from "../models/Certification.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import {
    calculateMatchScore
} from "../services/matching.service.js";

const createJob = asyncHandler(
    async (req, res) => {
        const {
            title,
            description,
            category,
            skills,
            experienceRequired,
            salaryMin,
            salaryMax,
            location,
            employmentType,
            vacancies,
            expiresAt
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !location?.city
        ) {
            throw new ApiError(
                400,
                "Title, description, category and city are required"
            );
        }

        const job = await Job.create({
            employer: req.user._id,
            title,
            description,
            category,
            skills,
            experienceRequired,
            salaryMin,
            salaryMax,
            location,
            employmentType,
            vacancies,
            expiresAt
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    }
);

const getJobs = asyncHandler(
    async (req, res) => {
        const {
            search,
            category,
            city,
            minSalary,
            maxSalary,
            experience,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {
            status: "active"
        };

        if (category) {
            filter.category =
                new RegExp(
                    category,
                    "i"
                );
        }

        if (city) {
            filter["location.city"] =
                new RegExp(
                    city,
                    "i"
                );
        }

        if (minSalary) {
            filter.salaryMax = {
                $gte: Number(minSalary)
            };
        }

        if (maxSalary) {
            filter.salaryMin = {
                $lte: Number(maxSalary)
            };
        }

        if (experience) {
            filter.experienceRequired = {
                $lte: Number(experience)
            };
        }

        if (search) {
            filter.$text = {
                $search: search
            };
        }

        const skip =
            (Number(page) - 1) *
            Number(limit);

        const [jobs, total] =
            await Promise.all([
                Job.find(filter)
                    .populate(
                        "employer",
                        "name profileImage"
                    )
                    .sort({
                        createdAt: -1
                    })
                    .skip(skip)
                    .limit(
                        Number(limit)
                    ),

                Job.countDocuments(filter)
            ]);

        res.status(200).json({
            success: true,
            jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages:
                    Math.ceil(
                        total /
                            Number(limit)
                    )
            }
        });
    }
);

const getJobById = asyncHandler(
    async (req, res) => {
        const job =
            await Job.findById(
                req.params.id
            ).populate(
                "employer",
                "name profileImage"
            );

        if (!job) {
            throw new ApiError(
                404,
                "Job not found"
            );
        }

        res.status(200).json({
            success: true,
            job
        });
    }
);

const updateJob = asyncHandler(
    async (req, res) => {
        const job =
            await Job.findOne({
                _id: req.params.id,
                employer: req.user._id
            });

        if (!job) {
            throw new ApiError(
                404,
                "Job not found or unauthorized"
            );
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "skills",
            "experienceRequired",
            "salaryMin",
            "salaryMax",
            "location",
            "employmentType",
            "vacancies",
            "status",
            "expiresAt"
        ];

        allowedFields.forEach(
            (field) => {
                if (
                    req.body[field] !==
                    undefined
                ) {
                    job[field] =
                        req.body[field];
                }
            }
        );

        await job.save();

        res.status(200).json({
            success: true,
            message:
                "Job updated successfully",
            job
        });
    }
);

const deleteJob = asyncHandler(
    async (req, res) => {
        const job =
            await Job.findOneAndDelete({
                _id: req.params.id,
                employer: req.user._id
            });

        if (!job) {
            throw new ApiError(
                404,
                "Job not found"
            );
        }

        res.status(200).json({
            success: true,
            message:
                "Job deleted successfully"
        });
    }
);

const applyForJob =
    asyncHandler(
        async (req, res) => {
            if (
                req.user.role !==
                "worker"
            ) {
                throw new ApiError(
                    403,
                    "Only workers can apply for jobs"
                );
            }

            const job =
                await Job.findById(
                    req.params.id
                );

            if (!job) {
                throw new ApiError(
                    404,
                    "Job not found"
                );
            }

            if (
                job.status !==
                "active"
            ) {
                throw new ApiError(
                    400,
                    "This job is no longer active"
                );
            }

            const existingApplication =
                await Application.findOne(
                    {
                        job: job._id,
                        worker:
                            req.user._id
                    }
                );

            if (
                existingApplication
            ) {
                throw new ApiError(
                    409,
                    "You have already applied for this job"
                );
            }

            const worker =
                await WorkerProfile.findOne(
                    {
                        user:
                            req.user._id
                    }
                ).lean();

            if (!worker) {
                throw new ApiError(
                    404,
                    "Worker profile not found"
                );
            }

            const certificationCount =
                await Certification.countDocuments(
                    {
                        worker:
                            req.user._id,
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

            const application =
                await Application.create({
                    job: job._id,
                    worker:
                        req.user._id,
                    matchScore:
                        result.score,
                    coverMessage:
                        req.body.coverMessage
                });

            res.status(201).json({
                success: true,
                message:
                    "Application submitted successfully",
                application,
                matchScore:
                    result.score
            });
        }
    );

export {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    applyForJob
};