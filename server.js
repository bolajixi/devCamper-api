const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");

dotenv.config({ path: "./config/config.env" });
connectDb();

// Import routes
const bootcamps = require("./routes/bootcamps");
const { deleteBootcamp } = require("./controllers/bootcamp");

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Monnt Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode, Port: ${PORT}`
	);
});
