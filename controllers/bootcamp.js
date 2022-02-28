const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
// @toute   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };

	let queryStr = JSON.stringify(reqQuery);

	const removeFields = ["select", "sort", "page", "limit"];

	removeFields.forEach((param) => {
		delete removeFields[param];
	});

	// using reg expr, replace any gt(greater than) with $gt
	// as a filter parameter for mongoose
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => {
		"$" + match;
	});

	query = Bootcamp.find(JSON.parse(queryStr));

	// Check if only select is in query params and return only epecified field
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	// Check is sort is in query params and sort by
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// Add paginantion
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	const bootcamp = await query;

	// pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	if (!bootcamp) {
		return next(new ErrorResponse(`No bootcamps not found`, 404));
	}

	res.status(200).json({
		success: true,
		count: bootcamp.length,
		pagination,
		data: bootcamp,
	});
});

// @desc    Get single bootcamps
// @toute   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return res.status(400).json({
			success: false,
		});
	}

	res.status(200).json({
		success: true,
		data: bootcamp,
		pagination,
	});
});

// @desc    Create new bootcamp
// @toute   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc    Update single bootcamp
// @toute   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(new ErrorResponse(`No bootcamps not found`, 404));
	}

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc    Remove single bootcamps
// @toute   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(new ErrorResponse(`No bootcamps not found`, 404));
	}

	res.status(200).json({
		success: true,
		count: Bootcamp.length,
		data: bootcamp,
	});
});

// @desc    Get bootcamps withtin a radius
// @toute   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calculate radius
	const radius = distance / 3963;

	// Find bootcamps within a geosphere using longi, lati and radius of the earth
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});
