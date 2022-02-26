const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @toute   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Get bootcamp`,
	});
};

// @desc    Get single bootcamps
// @toute   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Get bootcamp ${req.params.id}`,
	});
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
		res.status(400).json({
			success: false,
		});
	}
};

// @desc    Update single bootcamp
// @toute   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Update bootcamp ${req.params.id}`,
	});
};

// @desc    Remove single bootcamps
// @toute   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Delete bootcamp ${req.params.id}`,
	});
};
