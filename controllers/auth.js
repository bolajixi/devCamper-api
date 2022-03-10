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

	sendTokenResponse(user, 200, res);
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

	sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	});
};
