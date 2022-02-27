const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);

		console.log("Data imported");
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();

		console.log("Data collection cleared");
		process.exit(0);
	} catch (error) {
		console.error(error);
	}
};

// Check for either import/delete flag in command line
if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
