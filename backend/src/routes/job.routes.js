import { Router } from "express";

import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    applyForJob
} from "../controllers/job.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    getJobs
);

router.get(
    "/:id",
    getJobById
);

router.post(
    "/",
    verifyJWT,
    authorizeRoles("employer"),
    createJob
);

router.patch(
    "/:id",
    verifyJWT,
    authorizeRoles("employer"),
    updateJob
);

router.delete(
    "/:id",
    verifyJWT,
    authorizeRoles("employer"),
    deleteJob
);

router.post(
    "/:id/apply",
    verifyJWT,
    authorizeRoles("worker"),
    applyForJob
);

export default router;