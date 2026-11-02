import Application from "../models/Application.js";
import Job from "../models/Job.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";


/* =========================
   APPLY FOR JOB
========================= */

const applyForJob =
    asyncHandler(
        async (req, res) => {

            const {
                jobId
            } = req.body;


            if (!jobId) {

                throw new ApiError(
                    400,
                    "Job ID is required"
                );

            }


            const job =
                await Job.findById(
                    jobId
                );


            if (!job) {

                throw new ApiError(
                    404,
                    "Job not found"
                );

            }


            /* Prevent employer from applying
               to their own job */

            if (
                job.employer.toString() ===
                req.user._id.toString()
            ) {

                throw new ApiError(
                    400,
                    "You cannot apply to your own job"
                );

            }


            /* Prevent duplicate applications */

            const existingApplication =
                await Application.findOne({

                    worker:
                        req.user._id,

                    job:
                        jobId

                });


            if (existingApplication) {

                throw new ApiError(
                    409,
                    "You have already applied for this job"
                );

            }


            const application =
                await Application.create({

                    worker:
                        req.user._id,

                    job:
                        jobId,

                    status:
                        "applied"

                });


            const populatedApplication =
                await Application.findById(
                    application._id
                )
                    .populate(
                        "worker",
                        "name email phone profileImage isVerified"
                    )
                    .populate(
                        "job",
                        "title location salaryMin salaryMax"
                    );


            res.status(201).json({

                success: true,

                message:
                    "Application submitted successfully",

                application:
                    populatedApplication

            });

        }
    );


/* =========================
   GET EMPLOYER APPLICATIONS
========================= */

const getEmployerApplications =
    asyncHandler(
        async (req, res) => {

            const jobs =
                await Job.find({
                    employer:
                        req.user._id
                }).select("_id");


            const jobIds =
                jobs.map(
                    (job) => job._id
                );


            const applications =
                await Application.find({

                    job: {
                        $in: jobIds
                    }

                })
                    .populate(
                        "worker",
                        "name email phone profileImage isVerified"
                    )
                    .populate(
                        "job",
                        "title location salaryMin salaryMax"
                    )
                    .sort({

                        matchScore: -1,

                        createdAt: -1

                    });


            res.status(200).json({

                success: true,

                applications

            });

        }
    );


/* =========================
   UPDATE APPLICATION STATUS
========================= */

const updateApplicationStatus =
    asyncHandler(
        async (req, res) => {

            const {
                status,
                interviewDate,
                employerNotes
            } = req.body;


            const validStatuses = [

                "applied",
                "screening",
                "shortlisted",
                "interview",
                "selected",
                "rejected",
                "hired"

            ];


            if (
                !validStatuses.includes(
                    status
                )
            ) {

                throw new ApiError(
                    400,
                    "Invalid application status"
                );

            }


            const application =
                await Application.findById(
                    req.params.id
                ).populate(
                    "job"
                );


            if (!application) {

                throw new ApiError(
                    404,
                    "Application not found"
                );

            }


            if (
                application.job
                    .employer
                    .toString() !==
                req.user._id.toString()
            ) {

                throw new ApiError(
                    403,
                    "You are not authorized to update this application"
                );

            }


            application.status =
                status;


            if (
                interviewDate !==
                undefined
            ) {

                application.interviewDate =
                    interviewDate;

            }


            if (
                employerNotes !==
                undefined
            ) {

                application.employerNotes =
                    employerNotes;

            }


            await application.save();


            res.status(200).json({

                success: true,

                message:
                    "Application status updated",

                application

            });

        }
    );


/* =========================
   GET APPLICATION BY ID
========================= */

const getApplicationById =
    asyncHandler(
        async (req, res) => {

            const application =
                await Application.findById(
                    req.params.id
                )
                    .populate(
                        "worker",
                        "name email phone profileImage isVerified"
                    )
                    .populate(
                        "job"
                    );


            if (!application) {

                throw new ApiError(
                    404,
                    "Application not found"
                );

            }


            const isWorker =
                application.worker._id.toString() ===
                req.user._id.toString();


            const isEmployer =
                application.job.employer.toString() ===
                req.user._id.toString();


            if (
                !isWorker &&
                !isEmployer
            ) {

                throw new ApiError(
                    403,
                    "Unauthorized access"
                );

            }


            res.status(200).json({

                success: true,

                application

            });

        }
    );


export {

    applyForJob,

    getEmployerApplications,

    updateApplicationStatus,

    getApplicationById

};