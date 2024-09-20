const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');
const express = require('express');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRoutes = require("./authRoutes");
const testRoutes = require("./testRoutes");

const app = express();

// Add CORS middleware
app.use(cors());

// Log requests to the console
app.use(logger("dev"));

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Define your API routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// Main routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
