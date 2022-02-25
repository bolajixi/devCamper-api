const express = require("express");
const router = express.Router();

router.get("/api/v1/bootcamps", (req, res) => {
	res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

router.put("/api/v1/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Get bootcamp ${req.params.id}`,
	});
});

router.post("/api/v1/bootcamps", (req, res) => {
	res.status(200).json({ success: true, msg: "Create new bootcamps" });
});

router.put("/api/v1/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Update bootcamp ${req.params.id}`,
	});
});

router.delete("/api/v1/bootcamps/:id", (req, res) => {
	res.status(200).json({
		success: true,
		msg: `Delete bootcamp ${req.params.id}`,
	});
});

module.exports = router;
