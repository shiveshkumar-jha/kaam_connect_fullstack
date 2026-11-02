import { Router } from "express";

import {
    getProfile,
    updateProfile,
    addCertification,
    getRecommendedJobs,
    getApplications
} from "../controllers/worker.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(
    authorizeRoles("worker")
);

router.get(
    "/profile",
    getProfile
);

router.patch(
    "/profile",
    updateProfile
);

router.post(
    "/certifications",
    addCertification
);

router.get(
    "/recommended-jobs",
    getRecommendedJobs
);

router.get(
    "/applications",
    getApplications
);

export default router;