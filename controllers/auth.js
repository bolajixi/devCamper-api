const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

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

	sendTokenResponse(user, 200, res);
});

// @desc    Logout user / Clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

// @desc    Get current logged in User
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    UPDATE User Details
// @toute	PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
	};
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Update User Password
// @toute   GET /api/v1/auth/updatepassword
// @access  Public
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	// Check if current password
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse("Password is incorrect", 401));
	}
	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @desc    Forgot Password
// @toute   GET /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new ErrorResponse(
				`No user exists with email:${req.body.email}`,
				404
			)
		);
	}

	const resetToken = await user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	console.log(resetToken);
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password Reset Token",
			message,
		});

		res.status(200).json({
			success: true,
			data: "Email sent",
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse("Email could not be sent.", 500));
	}

	res.status(200).json({
		success: true,
		data: user,
	});
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
	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	});
};
