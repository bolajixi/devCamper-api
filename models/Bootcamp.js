const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
		unique: true,
		trim: true,
		maxLength: [50, "Name can not be more than 50 characters"],
	},
	slug: String,
	description: {
		type: String,
		required: [true, "Please add a description"],
		trim: true,
		maxLength: [50, "Name can not be more than 500 characters"],
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			"PLease use a valid URL with HTTP or HTTPS",
		],
	},
	phone: {
		type: String,
		maxLength: [20, "Phone Number can not be more than 20 characters"],
	},
	email: {
		type: String,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please ada avlid email",
		],
	},
	address: {
		type: String,
		required: [true, "Please add an address"],
	},
	location: {
		// GeoJson Point
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
			index: "2dsphere",
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipCode: String,
		country: String,
	},
	carrers: {
		type: [String],
		required: true,
		enum: [
			"Web Development",
			"Mobile Developement",
			"UI/UX",
			"Data Science",
			"Business",
			"Other",
		],
	},
	averageRating: {
		type: Number,
		min: [1, "Rating must be at least 1"],
		max: [10, "Rating can not be more than 10"],
	},
	averageCost: Number,
	photo: {
		type: String,
		default: "no-photo.jpg",
	},
	housing: {
		type: Boolean,
		default: false,
	},
	jpgAssistance: {
		type: Boolean,
		default: false,
	},
	jobGuarantee: {
		type: Boolean,
		default: false,
	},
	acceptGi: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
