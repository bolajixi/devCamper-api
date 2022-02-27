const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
// @toute   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.find();

		if (!bootcamp) {
			return next(new ErrorResponse(`No bootcamps not found`, 404));
		}

		res.status(200).json({
			success: true,
			count: Bootcamp.length,
			data: bootcamp,
		});
		console.log({ ...Bootcamp });
	} catch (error) {
		next(error);
	}
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
