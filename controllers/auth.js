const path = require("path");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Register A User
// @toute   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	const token = user.getSignedJwtToken();

	res.status(200).json({
		success: true,
		token,
	});
});

// @desc    Login User
// @toute   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		new ErrorResponse("Please provide an email and password", 400);
	}

	const user = await User.findOne({
		email: email,
	}).select("+password");

	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	const token = user.getSignedJwtToken();

	res.status(200).json({
		success: true,
		token,
	});
});
