const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDb = require("./config/db");

dotenv.config({ path: "./config/config.env" });
connectDb();

// Import routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const user = require("./routes/users");
const review = require("./routes/review");

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Middlewares
app.use(express.json());
app.use(fileupload());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
	WindowMs: 10 * 60 * 1000, // 10 Mins
	max: 20, // 20 requests
});
app.use(limiter);
app.use(hpp());

// Enable CORS
app.use(cors());

// Use Static folder
app.use(express.static(path.join(__dirname, "public")));

// Monnt Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/reviews", review);

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
