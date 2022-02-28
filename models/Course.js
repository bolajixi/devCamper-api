const mongoose = require("mongoose");
const { modelName } = require("./Bootcamp");

const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a course title"],
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	weeks: {
		type: String,
		required: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tutiotn cost"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add a minimum skill"],
		enum: ["beginner", "intermmediate", "advacned"],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectID,
		ref: "Bootcamp",
		required: true,
	},
});

module.exports = mongoose.model("Course", courseSchema);
