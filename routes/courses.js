const express = require("express");
const { getCoursess } = require("../controllers/courses");

const router = express.Router();

router.route("/").get(getCoursess);

module.exports = router;
