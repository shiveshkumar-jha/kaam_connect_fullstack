import jwt from "jsonwebtoken";
import User from "../models/User.js";
import WorkerProfile from "../models/WorkerProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:
                process.env.ACCESS_TOKEN_EXPIRY || "7d"
        }
    );
};

const register = asyncHandler(
    async (req, res) => {
        const {
            name,
            email,
            phone,
            password,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password||
            !role
        ) {
            throw new ApiError(
                400,
                "Name, email, password and role are required"
            );
        }

        if (
            !["worker", "employer"].includes(role)
        ) {
            throw new ApiError(
                400,
                "Invalid role"
            );
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(
                409,
                "User already exists"
            );
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role
        });

        if (role === "worker") {
            await WorkerProfile.create({
                user: user._id
            });
        }

        if (role === "employer") {
            await EmployerProfile.create({
                user: user._id,
                companyName: `${name}'s Company`
            });
        }

        const createdUser =
            await User.findById(user._id);

        const accessToken =
            generateAccessToken(createdUser);

        res.status(201)
            .cookie(
                "accessToken",
                accessToken,
                {
                    httpOnly: true,
                    secure:
                        process.env.NODE_ENV ===
                        "production",
                    sameSite: "lax",
                    maxAge:
                        7 * 24 * 60 * 60 * 1000
                }
            )
            .json({
                success: true,
                message:
                    "Registration successful",
                user: createdUser,
                accessToken
            });
    }
);

const login = asyncHandler(
    async (req, res) => {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            throw new ApiError(
                400,
                "Email and password are required"
            );
        }

        const user =
            await User.findOne({ email })
                .select("+password");

        if (!user) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const isPasswordCorrect =
            await user.isPasswordCorrect(
                password
            );

        if (!isPasswordCorrect) {
            throw new ApiError(
                401,
                "Invalid email or password"
            );
        }

        const accessToken =
            generateAccessToken(user);

        const safeUser =
            await User.findById(user._id);

        res.status(200)
            .cookie(
                "accessToken",
                accessToken,
                {
                    httpOnly: true,
                    secure:
                        process.env.NODE_ENV ===
                        "production",
                    sameSite: "lax",
                    maxAge:
                        7 * 24 * 60 * 60 * 1000
                }
            )
            .json({
                success: true,
                message: "Login successful",
                user: safeUser,
                accessToken
            });
    }
);

const logout = asyncHandler(
    async (req, res) => {
        res.clearCookie("accessToken");

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }
);

const getCurrentUser = asyncHandler(
    async (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
);

export {
    register,
    login,
    logout,
    getCurrentUser
};