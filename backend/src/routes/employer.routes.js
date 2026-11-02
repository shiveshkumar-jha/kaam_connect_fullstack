import { Router } from "express";

import {
    getProfile,
    updateProfile,
    getCandidates,
    getRecommendedCandidates,
    getDashboard
} from "../controllers/employer.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(
    authorizeRoles("employer")
);

router.get(
    "/profile",
    getProfile
);

router.patch(
    "/profile",
    updateProfile
);

router.get(
    "/candidates",
    getCandidates
);

router.get(
    "/jobs/:jobId/recommended-candidates",
    getRecommendedCandidates
);

router.get(
    "/dashboard",
    getDashboard
);

export default router;