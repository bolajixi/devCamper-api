const { query } = require("express");
const asyncHandler = require("../middleware/async");
const { rawListeners } = require("../models/Course");
const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get courses
// @toute   GET /api/v1/courses
// @toute   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId }).populate({
			path: "bootcamp",
			select: "name description",
		});
	} else {
		query = Course.find();
	}

	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});
