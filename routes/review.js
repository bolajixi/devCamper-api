const express = require("express");
const { getReviews } = require("../controllers/review");

const Review = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(
	advancedResults(Review, {
		path: "bootcamp",
		select: "name description",
	}),
	getReviews
);

module.exports = router;
