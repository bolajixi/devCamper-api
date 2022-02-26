const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @toute   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.find();

		if (!bootcamp) {
			return next(new ErrorResponse(`No bootcamps not found`, 404));
		}

		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get single bootcamps
// @toute   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};

// @desc    Create new bootcamp
// @toute   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Update single bootcamp
// @toute   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findOneAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!bootcamp) {
			return next(new ErrorResponse(`No bootcamps not found`, 404));
		}

		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Remove single bootcamps
// @toute   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return next(new ErrorResponse(`No bootcamps not found`, 404));
		}

		res.status(200).json({
			success: true,
			count: Bootcamp.length,
			data: bootcamp,
		});
	} catch (error) {
		next(error);
	}
};
