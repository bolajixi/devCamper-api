const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require("../controllers/bootcamp");
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Include other resouce routers
const courseRouter = require("./courses");

const router = express.Router();

// re route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, authorize("publisher", "admin"), createBootcamp);
router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
	.route("/:id")
	.get(getBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
