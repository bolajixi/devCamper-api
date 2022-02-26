const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;

	console.log(err.stack);

	// Mongoose bad objectId
	if (err.name === "CastError") {
		const message = `Resource with id of ${err.value} is not found`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate keys
	if (err.code === 11000) {
		const message = "Duplicate field value entered";
		error = new ErrorResponse(message, 400);
	}

	res.status(error.StatusCode || 500).json({
		success: false,
		error: error.message || "Internal Server Error",
	});
};

module.exports = errorHandler;
