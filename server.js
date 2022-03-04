const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
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

app.use(express.json());

// Monnt Routers
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode, Port: ${PORT}`
	);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, Promise) => {
	console.log(`Error: ${err.message}`);
	// CLose server and exit process
	server.close(() => process.exit(1));
});
