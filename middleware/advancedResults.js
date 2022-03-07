const advancedResults = (model, populate) => async (req, res, next) => {
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

	query = model.find(JSON.parse(queryStr));

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
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	const results = await query;

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

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

module.exports = advancedResults;
