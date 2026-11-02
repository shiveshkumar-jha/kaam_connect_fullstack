import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import workerRoutes from "./routes/worker.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",
        credentials: true
    })
);

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);

app.use(cookieParser());

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "KaamConnect API is running"
        });
    }
);

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/workers",
    workerRoutes
);

app.use(
    "/api/v1/employers",
    employerRoutes
);

app.use(
    "/api/v1/jobs",
    jobRoutes
);

app.use(
    "/api/v1/applications",
    applicationRoutes
);

app.use(
    errorMiddleware
);

export default app;