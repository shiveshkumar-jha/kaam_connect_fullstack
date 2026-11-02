import { Router } from "express";

import {
    applyForJob,
    getEmployerApplications,
    updateApplicationStatus,
    getApplicationById
} from "../controllers/application.controller.js";

import verifyJWT
    from "../middleware/auth.middleware.js";

import authorizeRoles
    from "../middleware/role.middleware.js";


const router = Router();


router.use(verifyJWT);


/* WORKER */

router.post(
    "/",
    authorizeRoles("worker"),
    applyForJob
);


/* EMPLOYER */

router.get(
    "/employer",
    authorizeRoles("employer"),
    getEmployerApplications
);


router.patch(
    "/:id/status",
    authorizeRoles("employer"),
    updateApplicationStatus
);


/* COMMON */

router.get(
    "/:id",
    getApplicationById
);


export default router;