const express = require("express");
const dotenv = require("dotenv");

// Import routes
const bootcamps = require("./routes/bootcamps");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Monnt Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode, Port: ${PORT}`
	);
});
