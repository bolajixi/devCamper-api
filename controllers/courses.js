const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single courses
// @route   GET /api/v1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		return next(
			new ErrorResponse(`No course with the ID of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc    Add Course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No Bootcamp with the ID of ${req.params.bootcampid}`,
				404
			)
		);
	}

	if (req.user.id !== bootcamp.user.toString() && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to add a Course to ${bootcamp._id}`,
				401
			)
		);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`No Course with the ID of ${req.params.id}`, 404)
		);
	}

	if (req.user.id !== course.user.toString() && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to update this course:${course._id}`,
				401
			)
		);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`No Course with the ID of ${req.params.id}`, 404)
		);
	}

	if (req.user.id !== course.user.toString() && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User ${req.user.id} is not authorized to delete this course:${course._id}`,
				401
			)
		);
	}

	await course.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
