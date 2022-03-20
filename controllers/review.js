const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });

		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single reviews
// @route   GET /api/v1/reviews/:id
// @access  Public

exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!review) {
		return next(
			new ErrorResponse(
				`No review found with the id of ${req.params.id}`
			),
			404
		);
	}

	return res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    Add a review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private

exports.addReview = asyncHandler(async (req, res, next) => {
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

	const review = await Review.create(req.body);

	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    Update a review
// @route   PUT /api/v1/bootcamps/reviews/:id
// @access  Private

exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No Review with the ID of ${req.params.id}`, 404)
		);
	}

	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(`No authorized to update review`, 401));
	}

	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    Delete a review
// @route   DELETE /api/v1/bootcamps/reviews/:id
// @access  Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No Review with the ID of ${req.params.id}`, 404)
		);
	}

	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(`No authorized to delete review`, 401));
	}

	await Review.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
