const express = require("express");
const {
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	updateDetails,
	updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router
	.post("/register", register)
	.post("/login", login)
	.get("/logout", logout)
	.get("/me", protect, getMe)
	.put("/updatedetails", protect, updateDetails)
	.put("/updatepassword", protect, updatePassword)
	.post("/forgotpassword", forgotPassword);

module.exports = router;
